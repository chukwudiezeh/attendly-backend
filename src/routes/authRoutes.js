const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  validateStudentRegistration, 
  validateLecturerRegistration, 
  validateLogin,
  validateVerifyToken,
  validateForgotPassword,
  validateVerifyResetToken,
  validateResetPassword
} = require('../middlewares/validators/authValidator');
const { validateToken } = require('../middlewares/tokenValidator');

// Auth routes
router.post('/register/student', validateStudentRegistration, authController.registerStudent);
router.post('/register/lecturer', validateLecturerRegistration, authController.registerLecturer);
router.post('/login', validateLogin, authController.login);
router.post('/verify', validateToken, validateVerifyToken, authController.verifyAccount);

// Resend verification email
router.post('/resend-verification', validateToken, authController.resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', validateForgotPassword, authController.requestPasswordReset);
router.post('/verify-reset-token', validateVerifyResetToken, authController.verifyResetToken);
router.post('/reset-password', validateResetPassword, authController.resetPassword);

module.exports = router;