var mongoose = require('mongoose')


const PinCodeSchema = new mongoose.Schema({

    zip_code: {
        type: Number,
        required: true,
    },

    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    county: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('PinCode', PinCodeSchema);