var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  stripeCUS: {
    type: String,
    required: false,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  otp: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
    unique: true,
  },
  ethncity: {
    type: String,
    required: false,
  },
  state: {
    type: Number,
    required: false,
  },
  city: {
    type: Number,
    required: false,
  },
  organizer: {
    type: Array,
    required: false,
  },
  musicType: {
    type: Array,
    required: false,
  },
  favoriteDrink: {
    type: Array,
    required: false,
  },
  eventType: {
    type: Array,
    required: false,
  },
  visibility: {
    type: Object,
    required: false,
  },
  approve: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  deviceToken: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    default: 'uploads/user/80da3218-eac6-4475-92be-7df4bc64ea90.jpg'
  },
  addOnDate: {
    type: Date,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  },
  isguest: {
    type: Boolean,
    required: false,
    default: false
  },

  relationship: {
    type: String,
    required: false,
  },
  profession: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  fcmToken: {
    type: String,
    required: false,
    unique: true,
  },
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return passwordHash.verify(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);