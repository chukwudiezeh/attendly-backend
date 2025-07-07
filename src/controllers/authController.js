const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class AuthController {
  async registerStudent(req, res) {
    try {
      const result = await authService.registerStudent(req.body);
      return successResponse(res, result, statusCodes.created, 'Student registered successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async registerLecturer(req, res) {
    try {
      const result = await authService.registerLecturer(req.body);
      return successResponse(res, result, statusCodes.created, 'Lecturer registered successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async login(req, res) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.login(identifier, password);
      return successResponse(res, result, statusCodes.ok, 'Login successful');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async verifyAccount(req, res) {
    try {
      const { token } = req.body;
      const userId = req.user._id; // This will come from the auth middleware
      
      const result = await authService.verifyAccount(userId, token);
      return successResponse(res, result, statusCodes.ok, 'Account verified successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async requestPasswordReset(req, res) {
    try {
      const { identifier } = req.body;
      const result = await authService.requestPasswordReset(identifier);
      return successResponse(res, result, statusCodes.ok, 'Password reset OTP sent to your email');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async verifyResetToken(req, res) {
    try {
      const { token, identifier } = req.body;
      const result = await authService.verifyResetToken(token, identifier);
      return successResponse(res, result, statusCodes.ok, 'Reset token verified successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      return successResponse(res, null, statusCodes.ok, result.message);
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Resend verification email
   * @route   POST /api/auth/resend-verification
   * @access  Private (token required)
   */
  async resendVerificationEmail(req, res) {
    try {
      const userId = req.user._id; // assuming req.user is set by validateToken middleware
      await authService.resendVerificationEmail(userId);

      return successResponse(
        res,
        null,
        statusCodes.ok,
        'Verification email resent successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error,
        statusCodes.serverError,
        'Error resending verification email'
      );
    }
  }
}

module.exports = new AuthController();