const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const academicYearSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{4}\/\d{4}$/  // Format: 2023/2024
  },
  semesters: [{
    name: {
      type: String,
      required: true,
      enum: ['first', 'second']
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  isCurrentYear: {
    type: Boolean,
    default: false
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

// Ensure only one current academic year
academicYearSchema.index(
  { isCurrentYear: 1 },
  { 
    unique: true,
    partialFilterExpression: { isCurrentYear: true }
  }
);

// Validate dates
academicYearSchema.pre('save', function(next) {
  // Validate semesters
  if (!this.semesters || this.semesters.length !== 2) {
    return next(new Error('Academic year must have exactly two semesters'));
  }

  const hasFirst = this.semesters.some(sem => sem.name === 'first');
  const hasSecond = this.semesters.some(sem => sem.name === 'second');
  
  if (!hasFirst || !hasSecond) {
    return next(new Error('Academic year must have one first semester and one second semester'));
  }

  next();
});

// Method to get current semester
academicYearSchema.methods.getCurrentSemester = function() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // Assuming first semester is from August to December
  // and second semester is from January to May
  if (currentMonth >= 8 && currentMonth <= 12) {
    return this.semesters.find(sem => sem.name === 'first');
  } else if (currentMonth >= 1 && currentMonth <= 5) {
    return this.semesters.find(sem => sem.name === 'second');
  }
  
  return null; // Outside of academic calendar
};

// Static method to get current academic year
academicYearSchema.statics.getCurrentYear = async function() {
  return this.findOne({ isCurrentYear: true });
};

const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

module.exports = AcademicYear; 