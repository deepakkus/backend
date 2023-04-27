var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;
// cardNumber
// CardHolderName
// ExpiryMonth
// ExpireYear
// Cvc
const paymentMethodSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  CardHolderName: {
    type: String,
    required: true,
  },
  ExpiryMonth: {
    type: String,
    required: true,
  },

  ExpireYear: {
    type: String,
    required: true,
  },
  cvc: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  type: {
    type: String,
    required: true,
    default: "paypal"
  },
  default: {
    type: Boolean,
    required: false,
    default: false
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  },
  createOn: {
    type: Date
  }
});


module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);