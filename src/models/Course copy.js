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
    uppercase: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 100,
    max: 700
  },
  unit: {
    type: Number,
    required: true,
    min: 1,
  },
  lecturer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteUrl: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes
courseSchema.index({ code: 1 });
courseSchema.index({ department: 1 });
courseSchema.index({ lecturer: 1 });

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