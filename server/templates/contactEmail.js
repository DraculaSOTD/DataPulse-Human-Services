// HTML Email Template for Contact Form Notification (sent to business)
const getContactNotificationEmail = (name, email, company, message) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a192f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0a192f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #112240; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(15, 213, 206, 0.1), rgba(138, 43, 226, 0.1)); padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid rgba(15, 213, 206, 0.3);">
              <h1 style="margin: 0; color: #0fd5ce; font-size: 28px; font-weight: 700;">
                🚀 New Contact Form Submission
              </h1>
              <p style="margin: 10px 0 0; color: #8892b0; font-size: 14px;">
                DataPulse AI Website Contact Form
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Contact Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <h2 style="margin: 0 0 20px; color: #ccd6f6; font-size: 18px; font-weight: 600;">
                      Contact Information
                    </h2>
                  </td>
                </tr>

                <!-- Name -->
                <tr>
                  <td style="padding: 15px; background-color: rgba(17, 34, 64, 0.6); border-radius: 8px; margin-bottom: 10px;">
                    <p style="margin: 0 0 5px; color: #8892b0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Name
                    </p>
                    <p style="margin: 0; color: #ccd6f6; font-size: 16px; font-weight: 500;">
                      ${name}
                    </p>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding: 15px; background-color: rgba(17, 34, 64, 0.6); border-radius: 8px; margin-top: 10px;">
                    <p style="margin: 0 0 5px; color: #8892b0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Email
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${email}" style="color: #0fd5ce; font-size: 16px; font-weight: 500; text-decoration: none;">
                        ${email}
                      </a>
                    </p>
                  </td>
                </tr>

                <!-- Company -->
                ${company ? `
                <tr>
                  <td style="padding: 15px; background-color: rgba(17, 34, 64, 0.6); border-radius: 8px; margin-top: 10px;">
                    <p style="margin: 0 0 5px; color: #8892b0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Company
                    </p>
                    <p style="margin: 0; color: #ccd6f6; font-size: 16px; font-weight: 500;">
                      ${company}
                    </p>
                  </td>
                </tr>
                ` : ''}

                <!-- Message -->
                <tr>
                  <td style="padding: 20px 15px; background-color: rgba(17, 34, 64, 0.6); border-radius: 8px; margin-top: 10px;">
                    <p style="margin: 0 0 10px; color: #8892b0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Message
                    </p>
                    <p style="margin: 0; color: #ccd6f6; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                      ${message}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0fd5ce, #0096ff); color: #0a192f; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(15, 213, 206, 0.3);">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: rgba(10, 25, 47, 0.8); text-align: center; border-top: 1px solid rgba(15, 213, 206, 0.2);">
              <p style="margin: 0; color: #8892b0; font-size: 14px;">
                Received at ${new Date().toLocaleString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                  timeZone: 'UTC'
                })} UTC
              </p>
              <p style="margin: 10px 0 0; color: #64ffda; font-size: 12px;">
                DataPulse AI • From Backlog to Bottom Line, Faster
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// HTML Email Template for Confirmation (sent to user)
const getConfirmationEmail = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting DataPulse AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a192f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0a192f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #112240; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(15, 213, 206, 0.1), rgba(60, 179, 113, 0.1)); padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid rgba(15, 213, 206, 0.3);">
              <h1 style="margin: 0; color: #64ffda; font-size: 32px; font-weight: 700;">
                ✨ Thank You for Reaching Out!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #ccd6f6; font-size: 18px; line-height: 1.6;">
                Hi <strong style="color: #0fd5ce;">${name}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #8892b0; font-size: 16px; line-height: 1.8;">
                We've received your message and appreciate you taking the time to connect with us at DataPulse AI.
              </p>

              <p style="margin: 0 0 20px; color: #8892b0; font-size: 16px; line-height: 1.8;">
                Our team will review your inquiry and get back to you within <strong style="color: #64ffda;">24 hours</strong>.
              </p>

              <!-- Info Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td style="padding: 25px; background: linear-gradient(135deg, rgba(60, 179, 113, 0.1), rgba(15, 213, 206, 0.1)); border-radius: 12px; border-left: 4px solid #3cb371;">
                    <p style="margin: 0 0 10px; color: #64ffda; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      What Happens Next?
                    </p>
                    <p style="margin: 0; color: #ccd6f6; font-size: 15px; line-height: 1.6;">
                      Our team will carefully review your inquiry and respond with personalized insights on how our Acceleration Engine can help transform your innovation backlog into delivered results.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #8892b0; font-size: 16px; line-height: 1.8;">
                In the meantime, feel free to explore more about our services and approach:
              </p>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 25px;">
                <tr>
                  <td align="center" style="padding: 10px;">
                    <a href="https://datapulseai.co/services" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #0fd5ce, #0096ff); color: #0a192f; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(15, 213, 206, 0.3);">
                      View Our Services
                    </a>
                  </td>
                  <td align="center" style="padding: 10px;">
                    <a href="https://datapulseai.co/about" style="display: inline-block; padding: 12px 28px; background-color: transparent; color: #0fd5ce; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; border: 2px solid #0fd5ce;">
                      Meet Our Team
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: rgba(10, 25, 47, 0.8); text-align: center; border-top: 1px solid rgba(15, 213, 206, 0.2);">
              <p style="margin: 0 0 10px; color: #ccd6f6; font-size: 16px; font-weight: 600;">
                DataPulse AI
              </p>
              <p style="margin: 0 0 15px; color: #64ffda; font-size: 13px; font-style: italic;">
                From Backlog to Bottom Line, Faster
              </p>
              <p style="margin: 0; color: #8892b0; font-size: 13px;">
                <a href="mailto:arthur@datapulseai.co" style="color: #0fd5ce; text-decoration: none;">arthur@datapulseai.co</a> •
                <a href="mailto:info@datapulseai.co" style="color: #0fd5ce; text-decoration: none;">info@datapulseai.co</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Plain text versions for email clients that don't support HTML
const getContactNotificationText = (name, email, company, message) => {
  return `
NEW CONTACT FORM SUBMISSION
DataPulse AI Website

Contact Information:
===================
Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}

Message:
========
${message}

Received at: ${new Date().toLocaleString('en-US', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'UTC'
})} UTC

Reply to this inquiry at: ${email}
  `.trim();
};

const getConfirmationText = (name) => {
  return `
Hi ${name},

Thank you for reaching out to DataPulse AI!

We've received your message and appreciate you taking the time to connect with us.

Our team will review your inquiry and get back to you within 24 hours.

In the meantime, feel free to explore more about our services at:
https://datapulseai.co/services

Best regards,
The DataPulse AI Team

---
DataPulse AI
From Backlog to Bottom Line, Faster
arthur@datapulseai.co • info@datapulseai.co
  `.trim();
};

module.exports = {
  getContactNotificationEmail,
  getConfirmationEmail,
  getContactNotificationText,
  getConfirmationText
};
