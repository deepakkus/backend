var mongoose = require('mongoose')
var passwordHash = require('password-hash');


// mongoose.Promise = global.Promise;

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    catId: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },

    ladiesDessCode: {
        type: String,
        required: false,
    },
    mensDessCode: {
        type: String,
        required: false,
    },
    cantwear: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: Number,
        required: true,
    },
    state: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    zipcode: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: false,
    },
    longitude: {
        type: String,
        required: false,
    },

    // musicType: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: false,
    // },
    musicType: {
        type: Array,
        required: false,
        default: []
    },
    djName: {
        type: Array,
        required: false,
        default: []
    },
    specialGuestsName: {
        type: Array,
        required: false,
        default: []
    },


    image: {
        type: String,
        required: true,
    },


    // tickets: {
    //     type: Array,
    //     required: false,
    // },
    // promotions: {
    //     type: Array,
    //     required: false,
    // },


    tableList: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: '6176f8192d742da4feebe3d8'
    },
    packageList: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: '6176f8192d742da4feebe3d8'

    },
    menuList: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: '6176f8192d742da4feebe3d8'

    },


    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    aoap: {
        type: Boolean,
        required: true,
        default: false
    },
    ticketsPay: {
        type: Boolean,
        required: true,
        default: false
    },
    packagesPay: {
        type: Boolean,
        required: true,
        default: false
    },
    menuPay: {
        type: Boolean,
        required: true,
        default: false
    },
    realtimeorders: {
        type: Boolean,
        required: true,
        default: false
    },

    tax: {
        type: Number,
        required: false
    },
    tips: {
        type: Number,
        required: false
    },
    deposit: {
        type: Number,
        required: false
    },
    tipsMin: {
        type: Number,
        required: false
    },
    depositMin: {
        type: Number,
        required: false
    },

    approve: {
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
});

module.exports = mongoose.model('Event', EventSchema);