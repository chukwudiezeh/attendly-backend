const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentCurriculumSchema = new Schema({
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  level: {
    type: Number,
    required: true,
    enum: [100, 200, 300, 400, 500]
  },
  semester: {
    type: String,
    required: true,
    enum: ['first', 'second']
  },
  courseType: {
    type: String,
    required: true,
    enum: ['core', 'elective', 'general']
  },
  creditUnits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'archived']
  },
  academicYear: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicYear',
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

// Ensure unique courses within the curriculum
departmentCurriculumSchema.index(
  { 'department': 1, 'course': 1, 'level': 1, 'semester': 1, 'academicYear': 1 },
  { unique: true }
);


const DepartmentCurriculum = mongoose.model('DepartmentCurriculum', departmentCurriculumSchema);

module.exports = DepartmentCurriculum; 