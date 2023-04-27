var mongoose = require('mongoose')


const PrivacyPolicySchema = new mongoose.Schema({

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

module.exports = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);