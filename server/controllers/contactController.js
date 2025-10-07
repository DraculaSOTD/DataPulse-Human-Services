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

    // Log the contact form submission
    console.log('Contact Form Submission:', {
      name,
      email,
      company: company || 'Not provided',
      message,
      timestamp: new Date().toISOString()
    });

    // In a production environment, you would:
    // 1. Save to a database
    // 2. Send an email notification
    // 3. Integrate with CRM (like Salesforce)
    // 4. Send confirmation email to the user

    // For now, we'll just log and return success
    res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request'
    });
  }
};

module.exports = {
  submitContact
};
