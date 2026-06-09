const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const emailService = require('../utils/emailService');

// Validation middleware
const validateContact = [
  check('name').trim().notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('subject').trim().notEmpty().withMessage('Subject is required'),
  check('message').trim().notEmpty().withMessage('Message is required')
];

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post('/', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message, company, phone, category } = req.body;

    // Create contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      company,
      phone,
      category: category || 'general',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contactMessage.save();

    // Send emails
    try {
      await emailService.sendContactFormEmail({
        name,
        email,
        subject,
        message,
        company,
        phone,
        category: category || 'general',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.',
      data: {
        id: contactMessage._id
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

module.exports = router;