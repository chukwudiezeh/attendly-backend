const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserOtp = require('../models/UserOtp');
const config = require('../configs/app');
const { userRoles, otpTypes, statusCodes } = require('../configs/constants');
const { generateRandomDigits } = require('../utils/helper');
const emailService = require('./emailService');
const AppError = require('../utils/AppError');

class AuthService {
  async registerStudent(userData) {
    if (!userData) {
      throw new AppError('No registration data provided', statusCodes.badRequest);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: userData.email.toLowerCase() },
        { matricNumber: userData.matricNumber.toLowerCase() }
      ]
    });

    if (existingUser) {
      throw new AppError(
        existingUser.email === userData.email 
          ? 'Email is already registered' 
          : 'Matric number is already registered',
        statusCodes.unauthorized
      );
    }

    const user = new User({
      ...userData,
      role: userRoles.student
    });

    try {
      await user.save();
      
      // Generate and save activation OTP
      const otp = await this.generateOtp(user._id, otpTypes.accountActivation);

      // Send verification email
      await emailService.dispatchAccountVerificationEmail(user, otp);

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new AppError(
        'Error creating user account',
        statusCodes.serverError
      );
    }
  }

  async registerLecturer(userData) {
    if (!userData) {
      throw new AppError('No registration data provided', statusCodes.badRequest);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email is already registered', statusCodes.conflict);
    }

    const user = new User({
      ...userData,
      role: userRoles.lecturer
    });

    try {
      await user.save();

      // Generate and save activation OTP
      const otp = await this.generateOtp(user._id, otpTypes.accountActivation);

      // Send verification email
      await emailService.dispatchAccountVerificationEmail(user, otp);

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new AppError(
        'Error creating lecturer account',
        statusCodes.serverError
      );
    }
  }

  async login(identifier, password) {
    // Find user by email or matric number
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { matricNumber: identifier }
      ]
    });
    if (!user) {
      throw new AppError('Unauthorized! Invalid user', statusCodes.unauthorized);
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', statusCodes.unauthorized);
    }

    return this.generateAuthResponse(user);
  }

  generateAuthResponse(user) {
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        email: user.email
      },
      config.jwt.secret,
      { expiresIn: parseInt(config.jwt.expiresIn) }
    );

    return {
      token,
      user
    };
  }

  /**
   * Generate a new OTP for a user
   * @param {string} userId - The user's ID
   * @param {string} type - The type of OTP (from otpTypes)
   * @returns {Promise<UserOtp>} The generated OTP
   */
  async generateOtp(userId, type) {
    // Generate a 6-digit random otp digits
    const code = generateRandomDigits(6);
    
    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Create new OTP
    const otp = new UserOtp({
      user: userId,
      code,
      type,
      expiresAt
    });

    await otp.save();
    return otp;
  }

  /**
   * Verify an OTP
   * @param {string} userId - The user's ID
   * @param {string} code - The OTP code to verify
   * @param {string} type - The type of OTP (from otpTypes)
   * @returns {Promise<User|boolean>} Returns updated user for account activation, true for other types
   */
  async verifyOtp(userId, code, type) {
    const otp = await UserOtp.findOne({
      user: userId,
      code,
      type,
      verifiedAt: null
    });

    if (!otp) {
      throw new AppError('Invalid verification code provided', statusCodes.badRequest);
    }

    if (otp.isExpired()) {
      throw new AppError('Verification code has expired', statusCodes.badRequest);
    }

    // Mark OTP as verified
    await otp.verify();

    let result;
    if (type === otpTypes.accountActivation) {
      // Update user's email verification status and return updated user
      result = await User.findByIdAndUpdate(
        userId,
        {
          emailVerified: true,
          emailVerifiedAt: new Date()
        },
        { new: true }
      );
    }

    return result;
  }

  /**
   * Verify account activation token
   * @param {string} userId - The user's ID
   * @param {string} token - The verification token
   * @returns {Promise<Object>} The updated user details
   */
  async verifyAccount(userId, token) {
    try {
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('Unauthorized! Invalid user', statusCodes.badRequest);
      }

      // Check if already verified
      if (user.emailVerified) {
        throw new AppError('Account is already verified', statusCodes.badRequest);
      }

      // Verify the OTP and get updated user
      const updatedUser = await this.verifyOtp(userId, token, otpTypes.accountActivation);
      return updatedUser;
      
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, statusCodes.serverError);
    }
  }

  /**
   * Request password reset
   * @param {string} identifier - Email or matric number
   * @returns {Promise<Object>} Success message
   */
  async requestPasswordReset(identifier) {
    // Find user by email or matric number
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { matricNumber: identifier }
      ]
    });

    if (!user) {
      throw new AppError('Unauthorized! Invalid user', statusCodes.unauthorized);
    }

    // Generate and save reset OTP
    const otp = await this.generateOtp(user._id, otpTypes.passwordReset);

    // Send password reset email
    await emailService.dispatchPasswordResetEmail(user, otp);

    return {
      message: 'Password reset instructions sent to your email'
    };
  }

  /**
   * Verify password reset token
   * @param {string} token - The verification token
   * @param {string} identifier - Email or matric number
   * @returns {Promise<Object>} Success message and user ID
   */
  async verifyResetToken(token, identifier) {
    // Find user by identifier
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { matricNumber: identifier }
      ]
    });

    if (!user) {
      throw new AppError('Unauthorized! Invalid user', statusCodes.unauthorized);
    }

    // Find the OTP
    const otp = await UserOtp.findOne({
      code: token,
      user: user._id,
      type: otpTypes.passwordReset,
      verifiedAt: null
    });

    if (!otp) {
      throw new AppError('Invalid reset token provided', statusCodes.badRequest);
    }

    if (otp.isExpired()) {
      throw new AppError('Verification code has expired', statusCodes.badRequest);
    }

    // Mark OTP as verified
    await otp.verify();

    return {
      identifier: identifier
    };
  }

  /**
   * Reset password
   * @param {string} token - The verification token
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(token, newPassword) {
    // Find the OTP
    const otp = await UserOtp.findOne({
      code: token,
      type: otpTypes.passwordReset,
      verifiedAt: { $ne: null }  // Must be verified
    });

    if (!otp) {
      throw new AppError('Invalid or unverified token', statusCodes.badRequest);
    }

    if (otp.isExpired()) {
      throw new AppError('Reset token has expired', statusCodes.badRequest);
    }

    // Update password
    const user = await User.findById(otp.user);
    if (!user) {
      throw new AppError('User not found', statusCodes.notFound);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Invalidate the used OTP
    await UserOtp.findByIdAndUpdate(
      otp._id,
      { verifiedAt: new Date() }
    );

    return {
      message: 'Password reset successful'
    };
  }

  static async resendVerificationEmail(userId) {
    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', statusCodes.notFound);
    }
    if (user.emailVerified) {
      throw new AppError('Account already verified', statusCodes.badRequest);
    }

    const otp = await this.generateOtp(user._id, otpTypes.accountActivation);

    // Send verification email
    await emailService.dispatchAccountVerificationEmail(user, otp);

    return true;
  }
}

module.exports = new AuthService();