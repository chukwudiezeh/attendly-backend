const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
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

// Create compound index for name and code
courseSchema.index({ name: 1, code: 1 }, { unique: true });

// Virtual to get full course info
courseSchema.virtual('fullInfo').get(function() {
  return `${this.code} - ${this.name} (${this.unit} units)`;
});

// Pre-save hook to generate invite URL if not provided
courseSchema.pre('save', function(next) {
  if (!this.inviteUrl) {
    this.inviteUrl = `${process.env.BASE_URL}/courses/join/${this._id}`;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 