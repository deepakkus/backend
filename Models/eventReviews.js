var mongoose = require('mongoose')


// mongoose.Promise = global.Promise;

const EventReviewsSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reviews: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: false,
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
  },
  createOn: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('EventReviews', EventReviewsSchema);