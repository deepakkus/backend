var mongoose = require("mongoose");
const Email = require("../../Models/emailContent");
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
        title: "required",
        subject: "required",
        content: "required",
        emailid: "required",
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({
            status: false,
            error: v.errors
        });
    }
    let emailData = {
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        subject: req.body.subject,
        content: req.body.content,
        emailid: req.body.emailid,
    };
    const email = await new Email(emailData);
    return email
        .save()
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: "New Email Created successfully",
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

    return Email.findOneAndUpdate(
      { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
      req.body,
      async (err, data) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err,
          });
        } else if (data != null) {
          data = { ...data._doc, ...req.body };
          return res.status(200).json({
            status: true,
            message: "Email Content update successful",
            data: data,
          });
        } else {
          return res.status(500).json({
            status: false,
            message: "Email Content not match",
            data: null,
          });
        }
      }
    );
  };
const viewAll = async (req, res) => {
    return Email.aggregate([{
                $match: {
                    isDelete: false
                }
            },
            {
                $project: {
                  token: 0,
                  __v: 0,
                }
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
                message: "Get All Mail ontent  Successfully",
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
const Delete = async (req, res) => {
    return Email.findOneAndUpdate(
      { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
      {
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
            message: "Email Content Delete successfully",
            data: data,
          });
        } else {
          return res.status(500).json({
            status: false,
            message: "FavoriteDrink not match",
            data: null,
          });
        }
      }
    );
  }
module.exports = {
    create,
    update,
    viewAll,
    Delete
};