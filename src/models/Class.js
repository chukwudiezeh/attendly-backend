const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'ClassSchedule',
    required: true
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
classSchema.index({ course: 1, status: 1 });
classSchema.index({ schedule: 1 });
classSchema.index({ createdBy: 1 });

const Class = mongoose.model('Class', classSchema);

module.exports = Class; 