const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  action: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
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

// Indexes for faster lookups
classLogSchema.index({ class: 1, createdAt: -1 });
classLogSchema.index({ user: 1, createdAt: -1 });

const ClassLog = mongoose.model('ClassLog', classLogSchema);

module.exports = ClassLog; 