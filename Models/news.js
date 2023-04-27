var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const NewsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    newstype: {
        type: String,
        required: true,
    },
    pubdate: {
        type: String,
        required: true,
    },
    newsimage: {
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

module.exports = mongoose.model('News', NewsSchema);