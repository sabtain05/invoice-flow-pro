const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price must be positive']
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'canceled'],
    default: 'draft'
  },
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [200, 'Client name cannot exceed 200 characters']
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    company: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    phone: String,
    taxId: String
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [itemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'PKR', 'INR', 'CNY', 'KRW', 'SGD', 'HKD', 'TRY', 'AED', 'SAR', 'KWD' ],
 }, 
    notes: String,
  terms: String,
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'payoneer', 'cash', 'check', 'other'],
    default: 'bank_transfer'
  },
  paymentInfo: {
    bankName: String,
    accountNumber: String,
    routingNumber: String,
    paypalEmail: String,
    otherDetails: String
  },
  sentAt: Date,
  paidAt: Date,
  reminderSent: [Date],
  lastReminderSent: Date,
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: Date
  }],
  history: [{
    action: String,
    timestamp: Date,
    changes: Object,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days overdue
invoiceSchema.virtual('daysOverdue').get(function() {
  if (this.status !== 'overdue') return 0;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = Math.abs(now - due);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  // Only recalculate if items or financial fields are modified
  if (this.isModified('items') || this.isModified('discount') || 
      this.isModified('discountType') || this.isModified('shipping')) {
    
    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    // Calculate tax
    this.taxAmount = this.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal * (item.taxRate || 0) / 100);
    }, 0);
    
    // Apply discount
    let discountAmount = 0;
    if (this.discount > 0) {
      if (this.discountType === 'percentage') {
        discountAmount = this.subtotal * (this.discount / 100);
      } else {
        discountAmount = this.discount;
      }
    }
    
    // Calculate total
    this.totalAmount = this.subtotal + this.taxAmount + (this.shipping || 0) - discountAmount;
    
    // Ensure total is not negative
    if (this.totalAmount < 0) {
      this.totalAmount = 0;
    }
  }
  
  // Update status based on dates
  if (this.isModified('dueDate') || this.isModified('status')) {
    const now = new Date();
    const due = new Date(this.dueDate);
    
    if (this.status !== 'paid' && this.status !== 'canceled' && due < now) {
      this.status = 'overdue';
    }
  }
  
  next();
});

// Indexes
invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ 'client.email': 1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ invoiceNumber: 'text', 'client.name': 'text' });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;