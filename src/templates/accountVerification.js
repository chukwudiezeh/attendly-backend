/**
 * Generates HTML email template for account verification
 * @param {Object} user - The user object containing firstName
 * @param {Object} otp - The OTP object containing code
 * @returns {string} HTML email template
 */
export const accountVerificationTemplate = (user, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Attendly Account</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #f0f0f0;
    }
    .header h2 {
      color: #2c3e50;
      margin: 0;
    }
    .content {
      padding: 20px 0;
    }
    .otp-code {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #2c3e50;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
      color: #6c757d;
      font-size: 14px;
    }
    .warning {
      color: #6c757d;
      font-size: 13px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to Attendly!</h2>
    </div>
    <div class="content">
      <p>Hi ${user.firstName},</p>
      <p>Thank you for registering with Attendly. To complete your registration, please use the following verification code:</p>
      
      <div class="otp-code">
        ${otp.code}
      </div>
      
      <p>This code will expire in 1 hour.</p>
      <p class="warning">If you didn't create an account with Attendly, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>The Attendly Team</p>
    </div>
  </div>
</body>
</html>
`; 