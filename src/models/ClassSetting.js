const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSettingSchema = new Schema({
  curriculumCourse: {
    type: Schema.Types.ObjectId,
    ref: 'DepartmentCurriculum',
    required: true,
    unique: true // One setting per course
  },
  allowedRadius: {
    type: Number,
    required: true,
    min: 1,
    default: 25, // 100 meters default
  },
  attendancePassMark: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 70 // 75% default
  },
  recurringClasses: {
    type: Boolean,
    required: true,
    default: true
  },
  autoCreateClass: {
    type: Boolean,
    required: true,
    default: false
  },
  shouldSendNotifications: {
    type: Boolean,
    required: true,
    default: true
  },
  notificationTimes: {
    type: [{
      type: Number
    }],
    default: [-1, 30, 10, 0], // Default reminder times in minutes
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

// Index for faster lookups
classSettingSchema.index({ curriculumCourse: 1 }, { unique: true });

// Virtual to get formatted pass mark
classSettingSchema.virtual('formattedPassMark').get(function() {
  return `${this.attendancePassMark}%`;
});

// Virtual to get formatted radius
classSettingSchema.virtual('formattedRadius').get(function() {
  return `${this.allowedRadius}m`;
});

// Virtual to get formatted notification times
classSettingSchema.virtual('formattedNotificationTimes').get(function() {
  return this.notificationTimes.map(time => {
    if (time === 0) return 'At class start';
    if (time > 0) return `${time} minutes before`;
    return `${Math.abs(time)} minutes after start`;
  });
});

// Static method to get default settings
classSettingSchema.statics.getDefaultSettings = function() {
  return {
    allowedRadius: 25,
    attendancePassMark: 70,
    recurringClasses: true,
    autoCreateClass: false,
    shouldSendNotifications: true,
    notificationTimes: [30, 10, 0]
  };
};

// Instance method to check if settings are default
classSettingSchema.methods.isDefaultSettings = function() {
  const defaults = this.constructor.getDefaultSettings();
  return (
    this.allowedRadius === defaults.allowedRadius &&
    this.attendancePassMark === defaults.attendancePassMark &&
    this.recurringClasses === defaults.recurringClasses &&
    this.autoCreateClass === defaults.autoCreateClass &&
    this.shouldSendNotifications === defaults.shouldSendNotifications &&
    JSON.stringify(this.notificationTimes.sort()) === JSON.stringify(defaults.notificationTimes.sort())
  );
};

const ClassSetting = mongoose.model('ClassSetting', classSettingSchema);

module.exports = ClassSetting; 