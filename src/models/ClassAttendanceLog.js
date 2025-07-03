const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  }
}, { _id: false });

const classAttendanceLogSchema = new Schema({
  attendance: {
    type: Schema.Types.ObjectId,
    ref: 'ClassAttendance',
    required: true
  },
  locationCoordinates: {
    type: locationSchema,
    required: true
  },
  locationStatus: {
    type: String,
    enum: ['inside', 'outside', 'border'],
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
classAttendanceLogSchema.index({ attendance: 1, createdAt: -1 });
classAttendanceLogSchema.index({ locationStatus: 1 });

const ClassAttendanceLog = mongoose.model('ClassAttendanceLog', classAttendanceLogSchema);

module.exports = ClassAttendanceLog; 