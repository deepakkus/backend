var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const FavoriteDrinkSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Added: {
    type: String,
    required: true,
    default: "Admin"
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  approve: {
    type: Boolean,
    required: true,
    default: false
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


module.exports = mongoose.model('FavoriteDrink', FavoriteDrinkSchema);