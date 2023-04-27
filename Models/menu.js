var mongoose = require('mongoose')
var passwordHash = require('password-hash');


const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
  },
  // description: {
  //   type: String,
  //   required: true,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  // },
  category: {
    type: Array,
    required: true,
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  createOn: {
    type: Date,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = mongoose.model('Menu', MenuSchema);