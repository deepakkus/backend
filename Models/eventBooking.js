var mongoose = require('mongoose')


const EventBookingSchema = new mongoose.Schema({

    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tickets: {
        type: Array,
    },
    menuBooking: {
        type: Object,
    },
    menuBook: {
        type: Boolean,
        default: false
    },
    
    bookingType: {
        type: String,
        required: true,
    },

    reason: {
        type: String,
        required: false,
    },

    bookingStatus: {
        type: String,
        required: true,
        default: "complete"
    },
    organizatiStatus: {
        type: String,
        required: true,
        default: "pending"
    },
    depositPercentage: {
        type: Number,
        required: true,
    },
    due: {
        type: String,
        required: true,
    },
    promocodeDiscount: {
        type: String,
    },


    propmoCode: {
        type: String,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    taxPercentage: {
        type: Number,
        required: true,
    },

    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    taxPercentage: {
        type: Number,
        required: true,
    },
    

    aoap: {
        type: Boolean,
        required: false,
    },
    ticketsPay: {
        type: Boolean,
        required: false,
    },
    tablesPay: {
        type: Boolean,
        required: false,
    },
    packagesPay: {
        type: Boolean,
        required: false,
    },
    menuPay: {
        type: Boolean,
        required: false,
    },
    realtimeorders: {
        type: Boolean,
        required: false,
    },


    tips: {
        type: Number,
        required: true,
    },

    tipsPercentage: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    split: {
        type: Boolean,
        required: true,
        default: false
    },
    approve: {
        type: Boolean,
        required: true,
        default: true
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
});

module.exports = mongoose.model('EventBooking', EventBookingSchema);
