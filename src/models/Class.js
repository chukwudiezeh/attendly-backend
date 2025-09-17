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


const classSchema = new Schema({
  curriculumCourse: {
    type: Schema.Types.ObjectId,
    ref: 'DepartmentCurriculum',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  geolocationData: {
    type: geolocationSchema,
    default: {}
  },
  classSchedule: {
    type: Schema.Types.ObjectId,
    ref: 'ClassSchedule',
    required: true
  },
  actualDate: {
    type: Date,
    required: true
  },
  actualStartTime: {
    type: Date,
    default: null
  },
  actualEndTime: {
    type: Date,
    default: null
  },
  scheduleOverride: {
    type: Schema.Types.ObjectId,
    ref: 'ClassScheduleOverride',
    default: null
  },
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

// Indexes for faster lookups
classSchema.index({ curriculumCourse: 1, status: 1 });
classSchema.index({ classSchedule: 1 });
classSchema.index({ createdBy: 1 });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;