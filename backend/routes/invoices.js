const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Invoice = require('../models/invoice');
const User = require('../models/user');
const InvoicePDFGenerator = require('../utils/pdfgenerator');

// Validation middleware
const validateInvoice = [
  check('client.name').trim().notEmpty().withMessage('Client name is required'),
  check('client.email').isEmail().withMessage('Client email must be valid'),
  check('dueDate').isISO8601().withMessage('Due date must be valid'),
  check('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  check('items.*.description').trim().notEmpty().withMessage('Item description is required'),
  check('items.*.quantity').isFloat({ gt: 0 }).withMessage('Quantity must be greater than 0'),
  check('items.*.unitPrice').isFloat({ gt: 0 }).withMessage('Unit price must be greater than 0')
];

// @route   GET /api/invoices
// @desc    Get all invoices for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;

    const query = { user: req.user._id, isDeleted: false };
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by invoice number or client name
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get invoices with pagination
    const invoices = await Invoice.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Invoice.countDocuments(query);

    // Calculate summary statistics
    const summary = await Invoice.aggregate([
      { $match: { user: req.user._id, isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      summary: summary.reduce((acc, curr) => {
        acc[curr._id] = {
          count: curr.count,
          totalAmount: curr.totalAmount
        };
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
router.post('/', auth, validateInvoice, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user._id);
    
    // Generate invoice number
    const invoiceNumber = user.generateInvoiceNumber();
    await user.save();

    // Calculate due date if not provided
    let dueDate = req.body.dueDate;
    if (!dueDate) {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (user.settings.paymentTerms || 30));
    }

    // Calculate totals before creating the invoice
    const items = req.body.items || [];
    
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    // Calculate tax
    const taxAmount = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal * (item.taxRate || 0) / 100);
    }, 0);

    // Calculate discount
    let discountAmount = 0;
    if (req.body.discount > 0) {
      if (req.body.discountType === 'percentage') {
        discountAmount = subtotal * (req.body.discount / 100);
      } else {
        discountAmount = req.body.discount;
      }
    }

    // Calculate total
    const totalAmount = subtotal + taxAmount + (req.body.shipping || 0) - discountAmount;

    // Create invoice with calculated values
    const invoiceData = {
      ...req.body,
      user: req.user._id,
      invoiceNumber,
      dueDate,
      currency: user.currency,
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: Math.max(totalAmount, 0) // Ensure total is not negative
    };

    // Create invoice
    const invoice = new Invoice(invoiceData);

    // Add to history
    invoice.history.push({
      action: 'created',
      timestamp: new Date(),
      changes: req.body,
      performedBy: req.user._id
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/invoices/:id/send
// @desc    Send invoice to client
// @access  Private
router.post('/:id/send', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    }).populate('user');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update status
    invoice.status = 'sent';
    invoice.sentAt = new Date();
    
    // Add to history
    invoice.history.push({
      action: 'sent',
      timestamp: new Date(),
      performedBy: req.user._id
    });

    await invoice.save();

    // Send email to client
    try {
      const emailService = require('../utils/emailService');
      await emailService.sendInvoiceEmail(invoice, invoice.client.email);
    } catch (emailError) {
      console.error('Failed to send invoice email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      invoice
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    invoice.isDeleted = true;
    invoice.deletedAt = new Date();
    
    // Add to history
    invoice.history.push({
      action: 'deleted',
      timestamp: new Date(),
      performedBy: req.user._id
    });

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/invoices/:id/send
// @desc    Send invoice to client
// @access  Private
router.post('/:id/send', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update status
    invoice.status = 'sent';
    invoice.sentAt = new Date();
    
    // Add to history
    invoice.history.push({
      action: 'sent',
      timestamp: new Date(),
      performedBy: req.user._id
    });

    await invoice.save();

    // TODO: Implement email sending logic
    // For now, return success

    res.json({
      success: true,
      message: 'Invoice marked as sent',
      invoice
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/invoices/:id/mark-paid
// @desc    Mark invoice as paid
// @access  Private
router.post('/:id/mark-paid', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update status
    invoice.status = 'paid';
    invoice.paidAt = new Date();
    
    // Add to history
    invoice.history.push({
      action: 'marked_paid',
      timestamp: new Date(),
      performedBy: req.user._id
    });

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice marked as paid',
      invoice
    });
  } catch (error) {
    console.error('Mark paid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/invoices/:id/download
// @desc    Download invoice as PDF
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    }).populate('user');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Generate PDF
    const generator = new InvoicePDFGenerator(invoice, req.user);
    const pdfBuffer = await generator.generate();

    // Add to history
    invoice.history.push({
      action: 'downloaded',
      timestamp: new Date(),
      performedBy: req.user._id
    });
    await invoice.save();

    // Set headers for PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF'
    });
  }
});

// @route   GET /api/invoices/stats/summary
// @desc    Get invoice statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const stats = await Invoice.aggregate([
      {
        $match: {
          user: req.user._id,
          isDeleted: false,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0]
            }
          },
          overdueAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'overdue'] }, '$totalAmount', 0]
            }
          },
          averageInvoice: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Monthly trends
    const monthlyTrends = await Invoice.aggregate([
      {
        $match: {
          user: req.user._id,
          isDeleted: false,
          createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        overdueAmount: 0,
        averageInvoice: 0
      },
      monthlyTrends
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;