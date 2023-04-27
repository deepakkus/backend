var mongoose = require("mongoose");
const User = require("../../Models/user");
const OrganizerUser = require("../../Models/organizerUser");
// var passwordHash = require("password-hash");
// var Upload = require("../../service/upload");
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

  return OrganizerUser.findOneAndUpdate(
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
          message: "Organizer update successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Organizer not match",
          data: null,
        });
      }
    }
  );
};

const viewAll = async (req, res) => {
  return OrganizerUser.aggregate([
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
        from: "events",
        localField: "_id",
        foreignField: "organizerId",
        as: "events",
      },
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
        "organizerTypeData.__v": 0,
        "secondaryTypeData.__v": 0,
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
        message: "Get All Organizer  Successfully",
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
  return OrganizerUser.remove({
    _id: { $in: [mongoose.Types.ObjectId(req.params.id)] },
  })
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: "Organizer delete successfully",
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
  return OrganizerUser.aggregate([
    {
      $match: { isDelete: false },
    },
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
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "organizerId",
        as: "events",
      },
    },
    {
      $lookup: {
          from: "eventbookings",
          localField: "_id",
          foreignField: "organizerId",
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
                  from: "users",
                  localField: "userId",
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
        token: 0,
        __v: 0,
        "organizerTypeData.__v": 0,
        "secondaryTypeData.__v": 0,
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
          message: "Get Organizer Data Successfully",
          data: data[0],
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "No Organizer Find",
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
  return OrganizerUser.findOneAndUpdate(
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
          message: "OrganizerUser Delete successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "OrganizerUser not match",
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
  viewSingel,
  ImageUpload,
};
