var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const CitySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    country_id: {
        type: Number,
        required: true,
    },
    country_code: {
        type: String,
        required: true,
    },
    state_id: {
        type: Number,
        required: true,
    },
    state_code: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
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

module.exports = mongoose.model('City', CitySchema);