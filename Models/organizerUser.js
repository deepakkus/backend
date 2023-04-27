var mongoose = require("mongoose");
var passwordHash = require("password-hash");

// mongoose.Promise = global.Promise;

const organizerUserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  //step 1
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  state: {
    type: Number,
    required: false,
  },
  city: {
    type: Number,
    required: false,
  },

  //step 2
  email: {
    type: String,
    unique: true,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  phoneVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  website: {
    type: String,
    required: false,
  },

  //step 3
  organizerType: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  secondaryType: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  organizerInformation: {
    type: String,
    required: false,
  },

  // step 4
  password: {
    type: String,
    required: true,
  },

  organizerTime: {
    type: Array,
    required: false,
  },
  ownerInfo: {
    type: Array,
    required: false,
  },
  paymentType: {
    type: Array,
    required: false,
  },

  token: {
    type: String,
    required: false,
    unique: true,
  },
  approve: {
    type: Boolean,
    required: true,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  freez: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  deviceToken: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    default: "uploads/user/80da3218-eac6-4475-92be-7df4bc64ea90.jpg",
  },
  addOnDate: {
    type: Date,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false,
  },
  tax: {
    type: String,
    required: false,
  },
  tips: {
    type: String,
    required: false,
  },
  deposit: {
    type: String,
    required: false,
  },
  tipsMin: {
    type: String,
    required: false,
  },
  depositMin: {
    type: String,
    required: false,
  },
});

organizerUserSchema.methods.comparePassword = function (candidatePassword) {
  return passwordHash.verify(candidatePassword, this.password);
};

module.exports = mongoose.model("organizerUser", organizerUserSchema);
