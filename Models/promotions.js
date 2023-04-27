var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const promotionsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  discountType: {
    type: String,
    required: true,
  },
  discountVal: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },

  minspend: {
    type: String,
    required: true,
  },
  maxdiscount: {
    type: String,
    required: true,
  },
  promotionStart: {
    type: Boolean,
    required: true,
    default: false
  },
  

  code: {
    type: String,
    required: true,
  },

  createOn: {
    type: Date,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
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
  isDelete: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = mongoose.model('promotions', promotionsSchema);