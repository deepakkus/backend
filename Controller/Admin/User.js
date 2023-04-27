var mongoose = require("mongoose");
const User = require("../../Models/user");
// var passwordHash = require("password-hash");
var Upload = require("../../service/upload");
const { Validator } = require("node-input-validator");
var uuidv1 = require("uuid").v1;

function createToken(data) {
  data.hase = uuidv1();
  return jwt.sign(data, "DonateSmile");
}

const create = async (req, res) => {
  const v = new Validator(req.body, {
    name: "required",
  });
  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(200).send({ status: false, error: v.errors });
  }
  // console.log(req.file);
  // if (typeof (req.file) == "undefined" || req.file == null) {
  //   return res.status(200).send({
  //     status: false, error: {
  //       "image": {
  //         "message": "The image field is mandatory.",
  //         "rule": "required"
  //       }
  //     }
  //   });
  // }
  // let image_url = await Upload.uploadFile(req, "type");

  let eventTypeData = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    // image: image_url,
  };

  const eventType = await new EventType(eventTypeData);
  return eventType
    .save()
    .then((data) => {
      return res.status(200).json({
        status: true,
        message: "New ambulance Price created successfully",
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
  // if (typeof (req.file) !== "undefined" && req.file !== null && typeof(req.file.originalname) != "undefined") {
  //   let image_url = await Upload.uploadFile(req, "type");
  //   req.body.image = image_url;
  // }

  return User.findOneAndUpdate(
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
          message: "User update successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "User not match",
          data: null,
        });
      }
    }
  );
};

const viewAll = async (req, res) => {
  return User.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [{ isguest: { $exists: false } }, { isguest: false }],
          },
          { isDelete: false },
        ],
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
        from: "follows",
        localField: "_id",
        foreignField: "sender",
        pipeline: [
          {
            $match: {
              accpect: false,
              status: true,
            },
          },
        ],
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "receiver",
        as: "followings",
      },
    },
    {
      $project: {
        token: 0,
        __v: 0,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ])
    .then((data) => {
      return res.status(200).json({
        status: true,
        message: "Get All User  Successfully",
        data: data,
        count: data.length,
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
  return User.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: "User delete successfully",
        data: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error,
      });
    });
};

const viewSingel = async (req, res) => {
  return User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) },
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
          from: "eventbookings",
          localField: "_id",
          foreignField: "userId",
          pipeline: [{
                  $match: {
                      isDelete: false,
                      bookingStatus: "complete",
                      status: true,
                      approve: true,
                  },
              },
              {
                $lookup: {
                  from: "events",
                  localField: "eventId",
                  foreignField: "_id",
                  as: "eventData",
                },
              },
              {
                $unwind: "$eventData",
              },  
          ],
          as: "bookings",
      },
    },
    {
      $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "sender",
          pipeline: [{
                  $match: {
                      isDelete: false,
                      accpect: true,
                      status: true,
                  },
              },  
              {
                $lookup: {
                  from: "users",
                  localField: "receiver",
                  foreignField: "_id",
                  as: "userData",
                },
              },
              {
                $unwind: "$userData",
              },
              {
                $project: {
                  "userData.token": 0,
                  "userData.password": 0,
                  "userData.organizer": 0,
                  "userData.musicType": 0,
                  "userData.favoriteDrink": 0,
                  "userData.eventType": 0,
                  "userData.__v": 0,
                  __v: 0,
                },
              },
          ],
          as: "following",
      },
    },
    {
      $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "receiver",
          pipeline: [{
                  $match: {
                      isDelete: false,
                      accpect: true,
                      status: true,
                  },
              },  
              {
                $lookup: {
                  from: "users",
                  localField: "sender",
                  foreignField: "_id",
                  as: "userData",
                },
              },
              {
                $unwind: "$userData",
              },
              {
                $project: {
                  "userData.token": 0,
                  "userData.password": 0,
                  "userData.organizer": 0,
                  "userData.musicType": 0,
                  "userData.favoriteDrink": 0,
                  "userData.eventType": 0,
                  "userData.__v": 0,
                  __v: 0,
                },
              },
          ],
          as: "follower",
      },
    },
    {
      $project: {
        token: 0,
        __v: 0,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ])
    .then((data) => {
      if (data && data.length > 0) {
        return res.status(200).json({
          status: true,
          message: "Get User Singel Successfully",
          data: data[0],
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "No user Find",
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
  let uploadDAta = await Upload.uploadFile(req, "user");
  if (uploadDAta.status) {
    res.send(uploadDAta);
  } else {
    res.send(uploadDAta);
  }
};

const Delete = async (req, res) => {
  return User.findOneAndUpdate(
    { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
    {
      isDelete: true,
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
          message: "User Delete successful",
          // data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "User not match",
          data: null,
        });
      }
    }
  );
};

module.exports = {
  create,
  update,
  viewAll,
  Delete,
  DeleteParmanet,
  viewSingel,
  ImageUpload,
};
