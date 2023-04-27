var mongoose = require("mongoose");
const Event = require("../../Models/event");
// var passwordHash = require("password-hash");
var Upload = require("../../service/upload");
const {
    Validator
} = require("node-input-validator");
var uuidv1 = require("uuid").v1;


function createToken(data) {
    data.hase = uuidv1();
    return jwt.sign(data, "DonateSmile");
}

const create = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        startDate: "required",
        endDate: "required",
        startTime: "required",
        endTime: "required",
        ladiesDessCode: "required",
        mensDessCode: "required",
        cantwear: "required",
        description: "required",
        musicType: "required",
        djName: "required|array",
        specialGuestsName: "required|array",
        image: "required",
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({
            status: false,
            error: v.errors
        });
    }
    let eventData = {
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        ladiesDessCode: req.body.ladiesDessCode,
        mensDessCode: req.body.mensDessCode,
        cantwear: req.body.cantwear,
        description: req.body.description,
        musicType: mongoose.Types.ObjectId(req.body.musicType),
        djName: req.body.djName,
        specialGuestsName: req.body.specialGuestsName,
        image: req.body.image,
        createOn: new Date(),

        organizerId: mongoose.Types.ObjectId(req.user._id),
    };

    const event = await new Event(eventData);
    return event
        .save()
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: "New Event created successfully",
                data: data,
            });
        })
        .catch((error) => {
            res.status(200).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
};

const update = async (req, res) => {

    return Event.findOneAndUpdate({
            _id: {
                $in: [mongoose.Types.ObjectId(req.params.id)]
            }
        },
        req.body,
        async (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err,
                });
            } else if (data != null) {
                data = {
                    ...data._doc,
                    ...req.body
                };
                return res.status(200).json({
                    status: true,
                    message: "Event update successful",
                    data: data,
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Event not match",
                    data: null,
                });
            }
        }
    );
};

const viewAll = async (req, res) => {
    return Event.aggregate([{
                $match: {
                    isDelete: false
                }
            },
            // {
            //     $lookup: {
            //         from: "musictypes",
            //         localField: "musicType",
            //         foreignField: "_id",
            //         as: "musicTypeData"
            //     }
            // },
            // {
            //     $unwind: "$musicTypeData"
            // },
            {
                $lookup: {
                    from: "organizerusers",
                    localField: "organizerId",
                    foreignField: "_id",
                    as: "organizerData"
                }
            },
            {
                $unwind: "$organizerData"
            },
            {
                $project: {
                    "organizerData.token": 0,
                    "organizerData.password": 0,
                    "organizerData.approve": 0,
                    "organizerData.status": 0,
                    "organizerData.deviceToken": 0,
                    "organizerData.__v": 0,
                    __v: 0,
                },
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: "Get All Event  Successfully",
                data: data,
            });
        })
        .catch((error) => {
            res.status(200).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
};

const DeleteParmanet = async (req, res) => {
    return Event.remove({
            _id: {
                $in: [mongoose.Types.ObjectId(req.params.id)]
            }
        })
        .then((data) => {
            return res.status(200).json({
                success: true,
                message: 'Event delete successfully',
                data: data
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: error,
            });
        });
}

const Delete = async (req, res) => {
    return Event.findOneAndUpdate({
            _id: {
                $in: [mongoose.Types.ObjectId(req.params.id)]
            }
        }, {
            isDelete: true
        },
        async (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err,
                });
            } else if (data != null) {
                return res.status(200).json({
                    status: true,
                    message: "Event Delete successful",
                    // data: data,
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Event not match",
                    data: null,
                });
            }
        }
    );
}

const viewSingel = async (req, res) => {
    return Event.aggregate([{
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            // {
            //     $lookup: {
            //         from: "musictypes",
            //         localField: "musicType",
            //         foreignField: "_id",
            //         as: "musicTypeData"
            //     }
            // },
            // {
            //     $unwind: "$musicTypeData"
            // },
            {
                $lookup: {
                    from: "organizerusers",
                    localField: "organizerId",
                    foreignField: "_id",
                    as: "organizerData"
                }
            },
            {
                $unwind: "$organizerData"
            },
            {
                $lookup: {
                    from: "tablelists",
                    localField: "tableList",
                    foreignField: "_id",
                    as: "tablelistsData",
                },
            },
            {
                $unwind: "$tablelistsData",
            },
            {
                $lookup: {
                    from: "packages",
                    localField: "packageList",
                    foreignField: "_id",
                    as: "packageListData",
                },
            },
            {
                $unwind: "$packageListData",
            },
            {
                $lookup: {
                    from: "menus",
                    localField: "menuList",
                    foreignField: "_id",
                    as: "menulistsData",
                },
            },
            {
                $unwind: "$menulistsData",
            },

            {
                $lookup: {
                    from: "eventbookings",
                    localField: "_id",
                    foreignField: "eventId",
                    pipeline: [{
                            $match: {
                                isDelete: false,
                                bookingStatus: "complete",
                                status: true,
                                approve: true,
                            },
                        },
                        
                    ],
                    as: "bookings",
                },
            },
            {
                $addFields: {
                    attend: {
                        $size: "$bookings"
                    },
                },
            },
            {
                $project: {
                    "organizerData.token": 0,
                    "organizerData.password": 0,
                    "organizerData.approve": 0,
                    "organizerData.status": 0,
                    "organizerData.deviceToken": 0,
                    "organizerData.__v": 0,
                    __v: 0,
                },
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])
        .then((data) => {
            if (data && data.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: "Get Event Singel Successfully",
                    data: data[0],
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "No Event Find",
                    data: null,
                });
            }

        })
        .catch((error) => {
            res.status(200).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
};

const ImageUpload = async (req, res) => {
    let uploadDAta = await Upload.uploadFile(req, "event");
    if (uploadDAta.status) {
        res.send(uploadDAta);
    } else {
        res.send(uploadDAta);
    }
}
module.exports = {
    // create,
    update,
    viewAll,
    Delete,
    viewSingel,
    ImageUpload,
    DeleteParmanet
};