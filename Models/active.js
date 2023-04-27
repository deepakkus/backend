var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const ActiveSchema = new mongoose.Schema({
  massage: {
    type: String,
    required: true,
  },
  sendId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  external: {
    type: Object
  },
  total: {
    type: Number,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  },
  createOn: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('Activity', ActiveSchema);