var mongoose = require('mongoose')
var OrganizerUser = require('../../Models/organizerUser')
var passwordHash = require('password-hash');

var jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
// const S3 = require('../../service/s3');
const Upload = require('../../service/upload');
const { DBerror } = require('../../service/errorHaldel');




function createToken(data) {
    return jwt.sign(data, 'DonateSmile');
}

const register = async (req, res) => {
    const v = new Validator(req.body, {
        name: 'required',
        address: 'required',
        zipCode: 'required|integer',
        state: 'required|integer',
        city: 'required|integer',

        email: 'required',
        phone: 'required|integer',
        // website: 'required',

        organizerType: 'required',
        secondaryType: 'required',
        organizerInformation: 'required',


        password: 'required|minLength:4',

    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    let OrganizerUserData = {
        _id: mongoose.Types.ObjectId(),

        name: req.body.name,
        address: req.body.address,
        zipCode: Number(req.body.zipCode),
        state: Number(req.body.state),
        city: Number(req.body.city),


        email: req.body.email,
        phone: Number(req.body.phone),
        website: req.body.website,

        organizerType: mongoose.Types.ObjectId(req.body.organizerType),
        secondaryType: mongoose.Types.ObjectId(req.body.secondaryType),
        organizerInformation: req.body.organizerInformation,

        password: passwordHash.generate(req.body.password),

        token: createToken(req.body),
        addOnDate: new Date(),
    };

    const organizerUser = await new OrganizerUser(OrganizerUserData);
    return organizerUser
        .save()
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: 'Organizer register successfully',
                data: data,
            });
        })
        .catch((error) => {
            let errorMessage = DBerror(error);
            res.status(200).json({
                status: false,
                message: errorMessage,
                error: error,
            });
        });
}

const login = async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required',
        password: 'required|minLength:4'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    return OrganizerUser.findOne({ email: req.body.email }, async (err, organizer) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'Server error. Please try again.',
                error: err,
            });
        } else if (organizer != null && organizer.comparePassword(req.body.password)) {
            if (organizer.approve) {
                await OrganizerUser.updateOne(
                    { _id: { $in: [mongoose.Types.ObjectId(organizer._id)] } },
                    { $set: { "deviceToken": req.body.deviceToken } }
                );
                organizer.password = null;
                return res.status(200).json({
                    status: true,
                    message: 'Organizer login successful',
                    data: organizer
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Your account is not approved yet. Please contact to admin.',
                    data: null
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: 'Sorry !!! Invalid Credentials',
                data: null
            });
        }
    });
    // res.send({status: false});
}


const getProfile = async (req, res) => {
    res.status(200).json({
        status: true,
        message: 'user profile get successful',
        data: req.user
    });
}

const getTokenData = async (token) => {
    let userData = await OrganizerUser.findOne({ token: token }).exec();
    // console.log('userData', userData);
    return userData;
}

const getProfileIdOrganizer = async (req, res) => {
    await OrganizerUser.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: "events",
                localField: "_id",
                foreignField: "organizerId",
                as: "events",
            },
        },
        {
            $addFields: {
                eventsId: "$events._id",
            },
        },
        {
            $lookup: {
                from: "eventreviews",
                // localField: "_id",
                // foreignField: "organizerId",
                let: { eventsId: "$eventsId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                    [
                                        { $in: ["$eventId", "$$eventsId"] }
                                    ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        token: 0,
                                        password: 0,
                                        approve: 0,
                                        status: 0,
                                        deviceToken: 0,
                                        organizer: 0,
                                        musicType: 0,
                                        favoriteDrink: 0,
                                        eventType:0,
                                        isDelete: 0,
                                        addOnDate: 0,
                                        __v: 0,
                                    },
                                },
                            ],
                            as: "userData"
                        }
                    },
                    {
                        $unwind: "$userData"
                    },
                ],
                as: "eventreviews",
            },
        },

        {
            $lookup: {
                from: "cities",
                localField: "city",
                foreignField: "id",
                as: "cityData",
            },
        },
        {
            $unwind: "$cityData",
        },
        {
            $lookup: {
                from: "states",
                localField: "state",
                foreignField: "id",
                as: "stateData",
            },
        },
        {
            $unwind: "$stateData",
        },

        {
            $lookup: {
                from: "organizers",
                localField: "organizerType",
                foreignField: "_id",
                as: "organizerTypeData",
            },
        },
        {
            $unwind: "$organizerTypeData",
        },
        {
            $lookup: {
                from: "organizers",
                localField: "secondaryType",
                foreignField: "_id",
                as: "secondaryTypeData",
            },
        },
        {
            $unwind: "$secondaryTypeData",
        },

        {
            $project: {
                token: 0,
                __v: 0,
                deviceToken: 0,
                password: 0,
                eventsId: 0,
                "organizerTypeData.__v": 0,
                "secondaryTypeData.__v": 0,
            },
        },
    ])
        .then((data) => {
            if (data && data.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: "Get Organizer Successfully",
                    data: data[0],
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "No Organizer Find",
                    data: [],
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
}

const update = async (req, res) => {
    // console.log("req.params.id", req.user._id);
    if (typeof (req.body.password) != "undefined") {
        req.body = req.splite(req.body, "password");
    }
    return OrganizerUser.findOneAndUpdate({ _id: { $in: [mongoose.Types.ObjectId(req.user._id)] } }, req.body, async (err, data) => {
        if (err) {
            let errorMessage = DBerror(err);
            return res.status(200).json({
                status: false,
                message: errorMessage,
                error: err,
            });
        } else if (data != null) {
            data = { ...data._doc, ...req.body };
            return res.status(200).json({
                status: true,
                message: 'Organizer update successful',
                data: data
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'Organizer not match',
                data: null
            });
        }
    })
}


const passwordChange = async (req, res) => {
    const v = new Validator(req.body, {
        password: 'required|minLength:8',
        oldPassword: 'required|minLength:8'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    return OrganizerUser.findOne({ _id: { $in: [mongoose.Types.ObjectId(req.user._id)] } }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'Server error. Please try again.',
                error: err,
            });
        } else if (user != null && user.comparePassword(req.body.oldPassword)) {
            await OrganizerUser.updateOne(
                { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
                { $set: { password: passwordHash.generate(req.body.password), } }
            );
            user.password = null;
            res.status(200).json({
                status: true,
                message: 'Organizer password change successful',
                data: user
            });
        } else {
            res.status(200).json({
                status: false,
                message: 'No BPO found',
                data: null
            });
        }
    });
}

const imageUpload = async (req, res) => {
    let uploadDAta = await Upload.uploadFile(req, "user");
    if (uploadDAta.status) {
        res.send(uploadDAta);
    } else {
        res.send(uploadDAta);
    }
}

const profilePicUpload = async (req, res) => {
    let uploadDAta = await Upload.uploadFile(req, "user");
    if (uploadDAta.status) {

        return OrganizerUser.findOneAndUpdate({ _id: { $in: [mongoose.Types.ObjectId(req.user._id)] } }, {
            image: uploadDAta.url
        }, async (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server error. Please try again.',
                    error: err,
                });
            } else if (data != null) {
                data = { ...req.body, ...data._doc };
                return res.status(200).json({
                    status: true,
                    message: 'Organizer profile Pic update successful',
                    data: data
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'Organizer not match',
                    data: null
                });
            }
        })
        // res.send(uploadDAta);
    } else {
        res.send(uploadDAta);
    }
}

module.exports = {
    register,
    login,
    getProfile,
    getTokenData,
    update,
    passwordChange,
    imageUpload,
    profilePicUpload,
    getProfileIdOrganizer
}
