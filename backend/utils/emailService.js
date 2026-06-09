const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Validate environment variables
    this.validateEnv();
    
    // Create transporter with Gmail-specific settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Gmail SMTP settings
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      requireTLS: true,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      },
      // Connection pooling
      pool: true,
      maxConnections: 1, // Gmail has rate limits
      maxMessages: 10,
      // Timeouts
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // Debug
      debug: true,
      logger: true
    });

    // Verify connection on startup
    this.verifyConnection();
  }

  validateEnv() {
    const required = ['EMAIL_USER', 'EMAIL_PASS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing email environment variables: ${missing.join(', ')}`);
    }

    // Check if using Gmail
    if (!process.env.EMAIL_USER.includes('@gmail.com')) {
      console.warn('⚠️  Warning: Not using Gmail address. App Passwords only work with Gmail.');
    }
  }

  async verifyConnection() {
    console.log('🔧 Testing Gmail SMTP connection...');
    console.log(`📧 Using email: ${process.env.EMAIL_USER}`);
    
    try {
      await this.transporter.verify();
      console.log('✅ Gmail SMTP connection verified successfully!');
      console.log('📌 Ready to send emails');
    } catch (error) {
      console.error('❌ Gmail SMTP connection failed!');
      console.error('Error details:', error.message);
      this.printTroubleshootingGuide();
      throw error;
    }
  }

  async sendContactFormEmail(contactData) {
    try {
      // Email to admin
      const adminMailOptions = {
        from: `"Invoice Flow Pro" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${contactData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">New Contact Form Submission</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
              <p><strong>Company:</strong> ${contactData.company || 'Not provided'}</p>
              <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
              <p><strong>Category:</strong> ${contactData.category || 'general'}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <div style="margin-top: 15px; padding: 15px; background: white; border-left: 4px solid #0ea5e9;">
                <strong>Message:</strong>
                <p style="white-space: pre-line; margin-top: 10px;">${contactData.message}</p>
              </div>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              <p>Received: ${new Date().toLocaleString()}</p>
              <p>IP Address: ${contactData.ipAddress || 'Unknown'}</p>
              <p>User Agent: ${contactData.userAgent || 'Unknown'}</p>
            </div>
          </div>
        `
      };

      // Auto-reply to sender
      const autoReplyOptions = {
        from: `"Invoice Flow Pro Support" <${process.env.EMAIL_USER}>`,
        to: contactData.email,
        subject: `We've received your message: ${contactData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0ea5e9; margin: 0;">Invoice Flow Pro</h1>
              <p style="color: #64748b; margin-top: 5px;">Professional Invoice Management</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
              <h2 style="color: #0ea5e9; margin-top: 0;">Thank You for Contacting Us!</h2>
              
              <p>Dear ${contactData.name},</p>
              
              <p>We've received your message and our team will get back to you within 24 hours.</p>
              
              <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <p><strong>Your Message Summary:</strong></p>
                <p><strong>Subject:</strong> ${contactData.subject}</p>
                <p><strong>Message:</strong> ${contactData.message.substring(0, 200)}${contactData.message.length > 200 ? '...' : ''}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              <p>Invoice Flow Pro • Blue Area, Islamabad, Pakistan</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        `
      };

      // Send both emails
      await Promise.all([
        this.transporter.sendMail(adminMailOptions),
        this.transporter.sendMail(autoReplyOptions)
      ]);

      console.log('Contact form emails sent successfully');
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendInvoiceEmail(invoice, clientEmail) {
    try {
      const mailOptions = {
        from: `"Invoice Flow Pro" <${process.env.EMAIL_USER}>`,
        to: clientEmail,
        subject: `Invoice ${invoice.invoiceNumber} from ${invoice.user.companyName || invoice.user.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0ea5e9; margin: 0;">Invoice Flow Pro</h1>
              <p style="color: #64748b; margin-top: 5px;">Professional Invoice Management</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
              <h2 style="color: #0ea5e9; margin-top: 0;">New Invoice</h2>
              
              <p>Hello ${invoice.client.name},</p>
              
              <p>You have a new invoice from <strong>${invoice.user.companyName || invoice.user.name}</strong>.</p>
              
              <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <table width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0;"><strong>Invoice #:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${invoice.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Issue Date:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${new Date(invoice.issueDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${new Date(invoice.dueDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Amount Due:</strong></td>
                    <td style="padding: 8px 0; text-align: right; font-size: 18px; color: #0ea5e9; font-weight: bold;">
                      ${new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.totalAmount)}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/invoices/${invoice._id}" 
                   style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View Invoice Online
                </a>
              </div>
              
              <p>You can also download a PDF copy of the invoice from the link above.</p>
              
              ${invoice.notes ? `
                <div style="margin-top: 20px; padding: 15px; background: #fff7ed; border-left: 4px solid #f59e0b; border-radius: 4px;">
                  <p><strong>Notes:</strong> ${invoice.notes}</p>
                </div>
              ` : ''}
              
              ${invoice.terms ? `
                <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px;">
                  <p><strong>Terms:</strong> ${invoice.terms}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              <p>This is an automated message from Invoice Flow Pro. Please do not reply to this email.</p>
              <p>If you have questions about this invoice, please contact ${invoice.user.email}</p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Invoice email sent to ${clientEmail}`);
      return true;
    } catch (error) {
      console.error('Invoice email error:', error);
      throw new Error('Failed to send invoice email');
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      
      const mailOptions = {
        from: `"Invoice Flow Pro Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password - Invoice Flow Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0ea5e9; margin: 0;">Invoice Flow Pro</h1>
              <p style="color: #64748b; margin-top: 5px;">Password Reset Request</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
              <h2 style="color: #0ea5e9; margin-top: 0;">Reset Your Password</h2>
              
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
              
              <div style="margin-top: 30px; padding: 15px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
                <p><strong>Security Note:</strong></p>
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>Never share your password or this link with anyone.</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              <p>This is an automated security message from Invoice Flow Pro.</p>
              <p>If you need further assistance, contact sabtainalipk144@gmail.com</p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Password reset email error:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();