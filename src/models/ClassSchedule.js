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

const classScheduleSchema = new Schema({
  curriculumCourse: {
    type: Schema.Types.ObjectId,
    ref: 'DepartmentCurriculum',
    required: true
  },
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  locationCoordinates: {
    type: locationSchema,
    required: true
  },
  locationName: {
    type: String,
    required: true
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

// Indexes for faster lookups
classScheduleSchema.index({ course: 1, day: 1 });

const ClassSchedule = mongoose.model('ClassSchedule', classScheduleSchema);

module.exports = ClassSchedule; 