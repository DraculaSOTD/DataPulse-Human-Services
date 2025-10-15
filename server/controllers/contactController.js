const { createTransporter } = require('../config/email');
const {
  getContactNotificationEmail,
  getConfirmationEmail,
  getContactNotificationText,
  getConfirmationText
} = require('../templates/contactEmail');

const submitContact = async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Please provide name, email, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        error: 'Message must be at least 10 characters long'
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        error: 'Message must be less than 5000 characters'
      });
    }

    // Log the contact form submission
    console.log('📧 Contact Form Submission:', {
      name,
      email,
      company: company || 'Not provided',
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email not configured. Form data logged but email not sent.');
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        note: 'Email service not configured - contact saved to logs'
      });
    }

    try {
      // Create transporter
      const transporter = createTransporter();

      // Email to business (notification)
      const businessMailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `🚀 New Contact Form Submission from ${name}`,
        text: getContactNotificationText(name, email, company, message),
        html: getContactNotificationEmail(name, email, company, message)
      };

      // Email to user (confirmation)
      const confirmationMailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✨ Thank you for contacting DataPulse AI',
        text: getConfirmationText(name),
        html: getConfirmationEmail(name)
      };

      // Send both emails
      const [businessEmail, confirmEmail] = await Promise.all([
        transporter.sendMail(businessMailOptions),
        transporter.sendMail(confirmationMailOptions)
      ]);

      console.log('✓ Business notification email sent:', businessEmail.messageId);
      console.log('✓ Confirmation email sent to user:', confirmEmail.messageId);

      // Success response
      res.status(200).json({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
      });

    } catch (emailError) {
      // Log email error but don't expose details to client
      console.error('✗ Error sending email:', emailError.message);

      // Still return success to user (form data is logged)
      res.status(200).json({
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        note: 'Your message was received but email notification may be delayed'
      });
    }

  } catch (error) {
    console.error('✗ Error processing contact form:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again or email us directly at arthur@datapulseai.co'
    });
  }
};

module.exports = {
  submitContact
};
