const nodemailer = require('nodemailer');
const config = require('../configs/app');

const transporter = nodemailer.createTransport({
  host: config.mail.smtpHost,
  port: config.mail.smtpPort,
  secure: config.mail.smtpSecure,
  auth: {
    user: config.mail.smtpUser,
    pass: config.mail.smtpPass,
  },
});

/**
 * Sends an email using nodemailer
 */
const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: config.mail.from,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendMail
};
