var mongoose = require('mongoose')
var passwordHash = require('password-hash');


const FollowSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    accpect: {
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
    isDelete: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = mongoose.model('Follow', FollowSchema);