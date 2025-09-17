const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geolocationSchema = new Schema({
  speed: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  altitude: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  longitude: { type: Number }, // not required
  latitude: { type: Number }   // not required
}, { _id: false });

const classAttendanceSchema = new Schema({
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
  checkInTime: {
    type: Date,
    default: null
  },
  checkInCoordinates: {
    type: geolocationSchema,
    default: {}
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  checkOutCoordinates: {
    type: geolocationSchema,
    default: {}
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
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

// Compound index to ensure one attendance record per user per class
classAttendanceSchema.index({ user: 1, class: 1 }, { unique: true });

// Indexes for faster lookups
classAttendanceSchema.index({ class: 1, status: 1 });
classAttendanceSchema.index({ user: 1, status: 1 });

// Virtual to get attendance duration in minutes
classAttendanceSchema.virtual('durationInMinutes').get(function() {
  if (!this.checkInTime || !this.checkOutTime) return 0;
  return Math.round((this.checkOutTime - this.checkInTime) / 1000 / 60);
});

const ClassAttendance = mongoose.model('ClassAttendance', classAttendanceSchema);

module.exports = ClassAttendance; 