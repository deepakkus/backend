var mongoose = require('mongoose')


const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },

    isSeen: {
        type: Boolean,
        required: true,
        default: false
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
    isDeleteUser: {
        type: Boolean,
        required: false,
        default: false
    },
    isDelete: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = mongoose.model('Message', MessageSchema);