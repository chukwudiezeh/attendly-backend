const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  description: {
    type: String
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

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department; 