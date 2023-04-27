var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const MenuListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  package: {
    type: Array,
    required: true,
  },

  // packageType: {
  //   type: String,
  //   required: true,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  // },

  // numberOfPackages: {
  //   type: String,
  //   required: true,
  // },
  // numberOfGuests: {
  //   type: String,
  //   required: true,
  // },
  // description: {
  //   type: String,
  //   required: true,
  // },
  createOn: {
    type: Date,
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
  // image: {
  //   type: String,
  //   required: false,
  //   default: 'https://eshendetesia.com/images/user-profile.png'
  // },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = mongoose.model('MenuList', MenuListSchema);