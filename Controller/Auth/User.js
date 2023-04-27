var mongoose = require('mongoose')
var User = require('../../Models/user')
var passwordHash = require('password-hash');

var jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
// const S3 = require('../../service/s3');
const Upload = require('../../service/upload');
const { DBerror } = require('../../service/errorHaldel');
const Email = require("../../Models/emailContent");
const { sendEmail } = require("../../service/email");


function createToken(data) {
    return jwt.sign(data, 'DonateSmile');
}
function getRandomInt(max) {
    return Math.floor(Math.random() * (max - 000000 + 1)) + 000000;
}
// "email": "guest@gmail.com",
const register = async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required',
        password: 'required|minLength:4',
        firstname: 'required',
        lastname: 'required',
        gender: 'required',
        dob: 'required',
        zipcode: 'required|integer',
        country: 'required',
        ethncity: 'required',
        state: 'required',
        city: 'required',
        phone: 'required'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    let UserData = {
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        dob: req.body.dob,
        zipcode: Number(req.body.zipcode),
        country: req.body.country,
        token: createToken(req.body),
        ethncity: req.body.ethncity,
        state: Number(req.body.state),
        city: Number(req.body.city),
        phone: req.body.phone,
        addOnDate: new Date(),
    };

    // if (typeof (req.body.phone) != "undefined") {
    //     UserData.phone = Number(req.body.phone);
    // }

    const user = await new User(UserData);
    return user
        .save()
        .then((data) => {
            const mail = Email.findOne(
                {title:"Event Register"}
            );
            sendEmail()
            return res.status(200).json({
                status: true,
                message: 'User register successfully',
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

    return User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'Server error. Please try again.',
                error: err,
            });
        } else if (user != null && user.comparePassword(req.body.password)) {
            if (user.approve) {
                await User.updateOne(
                    { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
                    { $set: { "deviceToken": req.body.deviceToken } }
                );
                user.password = null;
                return res.status(200).json({
                    status: true,
                    message: 'User login successful',
                    data: user,
                    accountVerified: true
                });

            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Your account is not approved yet. Please contact to admin.',
                    accountVerified: false,
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
}

const loginGuest = async (req, res) => {
    return User.findOne({ email: "guest@gmail.com" }, async (err, user) => {
        if (err) {
            return res.status(200).json({
                status: false,
                message: 'Server error. Please try again.',
                error: err,
            });
        } else if (user != null && user.isguest) {
            user.password = null;
            return res.status(200).json({
                status: true,
                message: 'User login successful',
                data: user,
                accountVerified: true
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'Sorry !!! Invalid Credentials',
                data: null
            });
        }
    });
}

const loginOtp = async (req, res) => {
    const v = new Validator(req.body, {
        phone: 'required|minLength:10'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    let otp = getRandomInt(999999);
    return User.findOne({ phone: req.body.phone }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'No User found',
                // error: err,
            });
        } else if (user != null) {
            await User.updateOne(
                { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
                { $set: { "otp": otp } }
            );
            user.password = null;
            res.status(200).json({
                status: true,
                message: 'User send otp successful ',
                data: {
                    otp: otp,
                    phone: req.body.phone
                }
            });
        } else {
            res.status(200).json({
                status: false,
                message: 'No User found',
                data: null
            });
        }
    });
    // res.send({status: false});
}

const loginOtpCheck = async (req, res) => {
    const v = new Validator(req.body, {
        phone: 'required|minLength:10',
        otp: 'required|minLength:6'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    return User.findOne({ phone: req.body.phone, otp: req.body.otp }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'No User found',
                // error: err,
            });
        } else if (user != null) {
            // await User.updateOne(
            //     { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
            //     { $set: { "deviceToken": req.body.deviceToken } }
            // );
            user.password = null;
            res.status(200).json({
                status: true,
                message: 'User login successful ',
                data: user
            });
        } else {
            res.status(200).json({
                status: false,
                message: 'No User otp found',
                data: null
            });
        }
    });
    // res.send({status: false});
}

const otpRequest = async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required|email'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    let otp = getRandomInt(999999);
    return User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'No User found',
            });
        } else if (user != null) {
            await User.updateOne(
                { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
                { $set: { "otp": otp } }
            );
            user.password = null;
            res.status(200).json({
                status: true,
                message: 'User send otp successful ',
                data: {
                    otp: otp,
                    email: req.body.email
                }
            });
        } else {
            res.status(200).json({
                status: false,
                message: 'No User found',
                data: null
            });
        }
    });
}

const forgetPassword = async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required|email',
        otp: 'required|minLength:6',
        password: 'required|minLength:4'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    return User.findOne({ email: req.body.email, otp: req.body.otp }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'No User found',
            });
        } else if (user != null) {
            await User.updateOne(
                { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
                {
                    $set: {
                        password: passwordHash.generate(req.body.password),
                    }
                }
            );
            user.password = null;
            res.status(200).json({
                status: true,
                message: 'User forget Password login successful ',
            });
        } else {
            res.status(200).json({
                status: false,
                message: 'No User otp found',
                data: null
            });
        }
    });
}

const getProfile = async (req, res) => {
    res.status(200).json({
        status: true,
        message: 'user profile get successful',
        data: req.user
    });
}

const getTokenData = async (token) => {
    let userData = await User.findOne({ token: token }).exec();
    // console.log('userData', userData);
    return userData;
}
const setFCMToken = async (req, res) => {
    return User.findOneAndUpdate(
        { _id: { $in: [mongoose.Types.ObjectId(req.body._id)] } },
        { $set: { fcmToken: req.body.fcmToken } },
        async (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err,
                  });
            }
            else
            {
                return res.status(200).json({
                    status: true,
                    message: "fcmToken Update successfully",
                    data: data,
                  });
            }
        }
        )
}
const update = async (req, res) => {
    if (typeof (req.body.password) != "undefined") {
        req.body = req.splite(req.body, "password");
    }
    return User.findOneAndUpdate({ _id: { $in: [mongoose.Types.ObjectId(req.user._id)] } }, req.body, async (err, data) => {
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
                message: 'User update successful',
                data: data
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'User not match',
                data: null
            });
        }
    })
}


const passwordChange = async (req, res) => {
    const v = new Validator(req.body, {
        password: 'required|minLength:4',
        oldPassword: 'required|minLength:4'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({ status: false, error: v.errors });
    }

    return User.findOne({ _id: { $in: [mongoose.Types.ObjectId(req.user._id)] } }, async (err, user) => {
        if (err) {
            res.status(200).json({
                status: false,
                message: 'Server error. Please try again.',
                error: err,
            });
        } else if (user != null && user.comparePassword(req.body.oldPassword)) {
            await User.updateOne(
                { _id: { $in: [mongoose.Types.ObjectId(user._id)] } },
                { $set: { password: passwordHash.generate(req.body.password), } }
            );
            user.password = null;
            res.status(200).json({
                status: true,
                message: 'user password change successful',
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

        return User.findOneAndUpdate({ _id: { $in: [mongoose.Types.ObjectId(req.user._id)] } }, {
            image: uploadDAta.url
        }, async (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server error. Please try again.',
                    error: err,
                });
            } else if (data != null) {
                data = { ...data._doc, ...req.body };
                return res.status(200).json({
                    status: true,
                    message: 'User profile Pic update successful',
                    data: data
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'User not match',
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
    setFCMToken,
    update,
    passwordChange,
    imageUpload,
    profilePicUpload,
    loginOtp,
    loginOtpCheck,
    forgetPassword,
    otpRequest,
    loginGuest
}
