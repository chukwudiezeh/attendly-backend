const { sendMail } = require('../utils/mailer');
const { accountVerificationTemplate } = require('../templates/accountVerification');
const { passwordResetTemplate } = require('../templates/passwordReset');

class EmailService {
  /**
   * Send account verification email to user
   * @param {Object} user - The user object
   * @param {Object} otp - The OTP object
   * @returns {Promise<void>}
   */
  async dispatchAccountVerificationEmail(user, otp) {
    const subject = 'Verify Your Attendly Account';

    try {
      await sendMail({
        to: user.email,
        subject,
        html: accountVerificationTemplate(user, otp)
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email to user
   * @param {Object} user - The user object
   * @param {Object} otp - The OTP object
   * @returns {Promise<void>}
   */
  async dispatchPasswordResetEmail(user, otp) {
    const subject = 'Reset Your Password';

    try {
      await sendMail({
        to: user.email,
        subject,
        html: passwordResetTemplate(user, otp)
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

module.exports = new EmailService();
