var mongoose = require('mongoose')
var passwordHash = require('password-hash');

const splitBookingUsersSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  isGest: {
    type: Boolean,
    required: false,
    default: false
  },
  approved:{
    type: Boolean,
    required: true,
    default: false
  },
  reject:{
    type: Boolean,
    required: true,
    default: false
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  }
});

// splitBookingUsersSchema.pre('save', async function (next) {
//   console.log('this', this);
//   next();
// });

module.exports = mongoose.model('SplitBookingUsers', splitBookingUsersSchema);