var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const TicketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  ticketName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  totalprice: {
    type: Number,
    required: true,
  },

  avl: {
    type: Number,
    required: true,
  },

  bookingr: {
    type: Number,
    required: true,
    default: 0
  },

  details: {
    type: String,
    required: false,
  },

  salestarts: {
    type: Boolean,
    required: true,
    default: true
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

module.exports = mongoose.model('Ticket', TicketSchema);