const mongoose = require('mongoose');
const { otpTypes } = require('../configs/constants');
const Schema = mongoose.Schema;

const userOtpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(otpTypes),
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add method to check if OTP is expired
userOtpSchema.methods.isExpired = function() {
  return Date.now() >= this.expiresAt;
};

// Add method to check if OTP is verified
userOtpSchema.methods.isVerified = function() {
  return this.verifiedAt !== null;
};

// Add method to verify OTP
userOtpSchema.methods.verify = function() {
  this.verifiedAt = new Date();
  return this.save();
};

const UserOtp = mongoose.model('UserOtp', userOtpSchema);

module.exports = UserOtp; 