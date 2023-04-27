var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const MenuMangeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  categoty: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  image: {
    type: String,
    required: false,
    default: 'https://eshendetesia.com/images/user-profile.png'
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = mongoose.model('MenuMange', MenuMangeSchema);