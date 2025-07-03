const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facultySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;