const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCourseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  curriculumCourseRole: {
    type: String,
    required: true,
    enum: ['student', 'lecturer_primary', 'lecturer_secondary', 'lecturer_assistant', 'course_representative',]
  },
  academicYear: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  level: {
    type: Number,
    required: true,
    enum: [100, 200, 300, 400, 500, 600]
  },
  semester: {
    type: String,
    required: true,
    enum: ['first', 'second']
  },
  curriculumCourse: {
    type: Schema.Types.ObjectId,
    ref: 'DepartmentCurriculum',
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
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
 
// Indexes
userCourseSchema.index({ user: 1, semester: 1, academicYear: 1, curriculumCourse: 1, curriculumCourseRole: 1 }, { unique: true });
userCourseSchema.index({ user: 1, academicYear: 1 });
userCourseSchema.index({ curriculumCourse: 1, semester: 1, academicYear: 1 });
userCourseSchema.index({ department: 1, level: 1 });
userCourseSchema.index({ status: 1 });
userCourseSchema.index({ curriculumCourseRole: 1 });

const UserCourse = mongoose.model('UserCourse', userCourseSchema);

module.exports = UserCourse; 