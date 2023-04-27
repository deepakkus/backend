var mongoose = require('mongoose')


const GetHelpSchema = new mongoose.Schema({
    titel: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    status: {
        type: Boolean,
        required: true,
        default: true
    },
    createOn: {
        type: Date,
        required: true,
    },
    isDelete: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = mongoose.model('GetHelp', GetHelpSchema);