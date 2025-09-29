const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  matricNumber: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'lecturer'],
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date,
    default: null
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500', '600'],
    default: null
  },
  semester: {
    type: String,
    enum: ['first', 'second'],
    default: null
  },
  academicYear: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicYear',
  },
  profilePicture: {
    type: String,
    default: null
  } 
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      
      delete ret._id;
      delete ret.password;
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Virtual for full user information
// userSchema.virtual('fullInfo').get(function() {
//   return `${this.name} (${this.role}${this.matricNumber ? ` - ${this.matricNumber}` : ''})`;
// });

const User = mongoose.model('User', userSchema);

module.exports = User; 