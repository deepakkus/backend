var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;
// cardNumber
// CardHolderName
// ExpiryMonth
// ExpireYear
// Cvc
const paymentRefundSchema = new mongoose.Schema({

    id: {
        type: String,
    },
    object: {
        type: String,
    },
    amount: {
        type: Number,
    },
    balance_transaction: {
        type: String,
    },
    charge: {
        type: String,
    },
    created: {
        type: Number,
    },
    currency: {
        type: String,
    },

    status: {
        type: String,
    },

    error: {
        type: String,
    },
    createOn: {
        type: Date
    }

});
module.exports = mongoose.model('paymentRefund', paymentRefundSchema);