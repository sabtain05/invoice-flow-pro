const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoicePDFGenerator {
  constructor(invoice, user) {
    this.invoice = invoice;
    this.user = user;
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });
    this.fonts = {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italic: 'Helvetica-Oblique'
    };
  }

  generateHeader() {
    // User/Company Info
    this.doc
      .fontSize(20)
      .font(this.fonts.bold)
      .text(this.user.companyName || this.user.name, 50, 50)
      .fontSize(10)
      .font(this.fonts.normal);
    
    if (this.user.address) {
      const address = [
        this.user.address.street,
        `${this.user.address.city}, ${this.user.address.state} ${this.user.address.zipCode}`,
        this.user.address.country
      ].filter(Boolean).join('\n');
      
      this.doc.text(address, 50, 80);
    }
    
    if (this.user.phone) {
      this.doc.text(`Phone: ${this.user.phone}`, 50, 120);
    }
    
    if (this.user.email) {
      this.doc.text(`Email: ${this.user.email}`, 50, 135);
    }
    
    if (this.user.businessNumber) {
      this.doc.text(`Business #: ${this.user.businessNumber}`, 50, 150);
    }

    // Invoice Title
    this.doc
      .fontSize(24)
      .font(this.fonts.bold)
      .text('INVOICE', 350, 50, { align: 'right' })
      .fontSize(12)
      .font(this.fonts.normal)
      .text(`#${this.invoice.invoiceNumber}`, 350, 80, { align: 'right' });

    // Invoice Details
    const detailsY = 120;
    const details = [
      `Date: ${new Date(this.invoice.issueDate).toLocaleDateString()}`,
      `Due Date: ${new Date(this.invoice.dueDate).toLocaleDateString()}`,
      `Status: ${this.invoice.status.toUpperCase()}`,
      `Payment Terms: ${this.user.settings.paymentTerms || 30} days`
    ];

    details.forEach((detail, i) => {
      this.doc.text(detail, 350, detailsY + (i * 15), { align: 'right' });
    });

    // Client Info
    this.doc
      .fontSize(14)
      .font(this.fonts.bold)
      .text('Bill To:', 50, 180)
      .fontSize(10)
      .font(this.fonts.normal)
      .text(this.invoice.client.name, 50, 200);

    if (this.invoice.client.company) {
      this.doc.text(this.invoice.client.company, 50, 215);
    }

    const clientAddress = [
      this.invoice.client.address?.street,
      this.invoice.client.address?.city,
      this.invoice.client.address?.state,
      this.invoice.client.address?.zipCode,
      this.invoice.client.address?.country
    ].filter(Boolean).join('\n');

    if (clientAddress) {
      this.doc.text(clientAddress, 50, 230);
    }

    if (this.invoice.client.email) {
      this.doc.text(`Email: ${this.invoice.client.email}`, 50, 265);
    }

    if (this.invoice.client.phone) {
      this.doc.text(`Phone: ${this.invoice.client.phone}`, 50, 280);
    }

    if (this.invoice.client.taxId) {
      this.doc.text(`Tax ID: ${this.invoice.client.taxId}`, 50, 295);
    }
  }

  generateItemsTable() {
    const tableTop = 320;
    const itemCodeX = 50;
    const descriptionX = 100;
    const quantityX = 350;
    const unitPriceX = 400;
    const amountX = 470;

    // Table Header
    this.doc
      .fontSize(10)
      .font(this.fonts.bold)
      .text('Item', itemCodeX, tableTop)
      .text('Description', descriptionX, tableTop)
      .text('Qty', quantityX, tableTop, { width: 40, align: 'right' })
      .text('Unit Price', unitPriceX, tableTop, { width: 60, align: 'right' })
      .text('Amount', amountX, tableTop, { width: 60, align: 'right' })
      .moveTo(50, tableTop + 15)
      .lineTo(530, tableTop + 15)
      .stroke();

    // Table Rows
    let y = tableTop + 30;
    
    this.invoice.items.forEach((item, index) => {
      if (y > 700) {
        this.doc.addPage();
        y = 50;
      }

      const itemTotal = item.quantity * item.unitPrice;
      
      this.doc
        .font(this.fonts.normal)
        .fontSize(10)
        .text(index + 1, itemCodeX, y, { width: 40 })
        .text(item.description, descriptionX, y, { width: 240 })
        .text(item.quantity.toFixed(2), quantityX, y, { width: 40, align: 'right' })
        .text(this.formatCurrency(item.unitPrice), unitPriceX, y, { width: 60, align: 'right' })
        .text(this.formatCurrency(itemTotal), amountX, y, { width: 60, align: 'right' });

      if (item.taxRate > 0) {
        this.doc
          .font(this.fonts.italic)
          .fontSize(8)
          .text(`${item.taxRate}% Tax`, descriptionX, y + 12);
      }

      y += 30;
    });

    // Table Footer
    this.doc
      .moveTo(50, y)
      .lineTo(530, y)
      .stroke();

    return y + 20;
  }

  generateTotals(startY) {
    let y = startY;
    const rightColumnX = 400;

    // Subtotal
    this.doc
      .fontSize(10)
      .font(this.fonts.normal)
      .text('Subtotal:', rightColumnX, y, { width: 100, align: 'right' })
      .text(this.formatCurrency(this.invoice.subtotal), 470, y, { width: 60, align: 'right' });

    // Discount
    if (this.invoice.discount > 0) {
      y += 20;
      const discountText = this.invoice.discountType === 'percentage' 
        ? `Discount (${this.invoice.discount}%)`
        : 'Discount';
      
      this.doc
        .text(discountText + ':', rightColumnX, y, { width: 100, align: 'right' })
        .text(`-${this.formatCurrency(
          this.invoice.discountType === 'percentage' 
            ? (this.invoice.subtotal * this.invoice.discount / 100)
            : this.invoice.discount
        )}`, 470, y, { width: 60, align: 'right' });
    }

    // Tax
    if (this.invoice.taxAmount > 0) {
      y += 20;
      this.doc
        .text('Tax:', rightColumnX, y, { width: 100, align: 'right' })
        .text(this.formatCurrency(this.invoice.taxAmount), 470, y, { width: 60, align: 'right' });
    }

    // Shipping
    if (this.invoice.shipping > 0) {
      y += 20;
      this.doc
        .text('Shipping:', rightColumnX, y, { width: 100, align: 'right' })
        .text(this.formatCurrency(this.invoice.shipping), 470, y, { width: 60, align: 'right' });
    }

    // Total
    y += 30;
    this.doc
      .fontSize(12)
      .font(this.fonts.bold)
      .text('TOTAL:', rightColumnX, y, { width: 100, align: 'right' })
      .text(this.formatCurrency(this.invoice.totalAmount), 470, y, { width: 60, align: 'right' })
      .moveTo(rightColumnX, y + 20)
      .lineTo(530, y + 20)
      .stroke();
  }

  generateFooter(y) {
    const footerY = Math.max(y + 50, 650);
    
    // Notes
    if (this.invoice.notes) {
      this.doc
        .fontSize(10)
        .font(this.fonts.bold)
        .text('Notes:', 50, footerY)
        .font(this.fonts.normal)
        .text(this.invoice.notes, 50, footerY + 15, { width: 250 });
    }

    // Terms
    if (this.invoice.terms) {
      this.doc
        .fontSize(10)
        .font(this.fonts.bold)
        .text('Terms:', 310, footerY)
        .font(this.fonts.normal)
        .text(this.invoice.terms, 310, footerY + 15, { width: 220 });
    }

    // Payment Information
    if (this.invoice.paymentInfo) {
      const paymentY = footerY + (this.invoice.notes ? 60 : 0);
      this.doc
        .fontSize(10)
        .font(this.fonts.bold)
        .text('Payment Information:', 50, paymentY)
        .font(this.fonts.normal);

      let paymentText = '';
      switch (this.invoice.paymentMethod) {
        case 'bank_transfer':
          paymentText = `Bank Transfer\nBank: ${this.invoice.paymentInfo.bankName}\nAccount: ${this.invoice.paymentInfo.accountNumber}\nRouting: ${this.invoice.paymentInfo.routingNumber}`;
          break;
        case 'paypal':
          paymentText = `PayPal: ${this.invoice.paymentInfo.paypalEmail}`;
          break;
        default:
          paymentText = this.invoice.paymentMethod.charAt(0).toUpperCase() + 
                       this.invoice.paymentMethod.slice(1).replace('_', ' ');
      }

      this.doc.text(paymentText, 50, paymentY + 15, { width: 250 });
    }

    // Footer Text
    const userFooter = this.user.settings.footerText || 'Thank you for your business!';
    this.doc
      .fontSize(8)
      .font(this.fonts.italic)
      .text(userFooter, 50, 750, { align: 'center', width: 500 });
  }

  formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.invoice.currency || 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  }

  generate() {
    return new Promise((resolve, reject) => {
      try {
        const chunks = [];
        
        this.doc.on('data', chunk => chunks.push(chunk));
        this.doc.on('end', () => resolve(Buffer.concat(chunks)));
        this.doc.on('error', reject);

        this.generateHeader();
        const itemsEndY = this.generateItemsTable();
        this.generateTotals(itemsEndY);
        this.generateFooter(itemsEndY);
        
        this.doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = InvoicePDFGenerator;