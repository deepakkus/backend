var mongoose = require("mongoose");
const MusicType = require("../../Models/musicType");
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

  let musicTypeData = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    // image: image_url,
  };

  const musicType = await new MusicType(musicTypeData);
  return musicType
    .save()
    .then((data) => {
      return res.status(200).json({
        status: true,
        message: "New Music Type created successfully",
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


  return MusicType.findOneAndUpdate(
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
          message: "MusicType update successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "MusicType not match",
          data: null,
        });
      }
    }
  );
};

const viewAll = async (req, res) => {
  return MusicType.aggregate([
    {
      $match: { isDelete: false }
    },
    {
      $project: {
        token: 0,
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
        message: "Get All MusicType  Successfully",
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
  return MusicType.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: 'MusicType delete successfully',
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
  return MusicType.findOneAndUpdate(
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
          message: "MusicType Delete successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "MusicType not match",
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
