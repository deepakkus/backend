var mongoose = require('mongoose')


const PaymentHistorySchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
    },
    balanceTransaction: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    BookingId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    email: {
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

module.exports = mongoose.model('PaymentHistory', PaymentHistorySchema);