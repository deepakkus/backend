var mongoose = require("mongoose");
const EventType = require("../../Models/eventType");
// var passwordHash = require("password-hash");
// var Upload = require("../../service/upload");
const { Validator } = require("node-input-validator");
const PrivacyPolicy = require("../../Models/privacyPolicy");
var uuidv1 = require("uuid").v1;


function createToken(data) {
  data.hase = uuidv1();
  return jwt.sign(data, "DonateSmile");
}

const create = async (req, res) => {
  const v = new Validator(req.body, {
    description: "required"
  });
  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(200).send({ status: false, error: v.errors });
  }

  let dataSet = {
    ...req.body,
    createOn: new Date()
  };

  const modelData = await new PrivacyPolicy(dataSet);
  return modelData
    .save()
    .then((data) => {
      return res.status(200).json({
        status: true,
        message: "New Privacy Policy created successfully",
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

  return PrivacyPolicy.findOneAndUpdate(
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
          message: "PrivacyPolicy update successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "PrivacyPolicy not match",
          data: null,
        });
      }
    }
  );
};

const viewAll = async (req, res) => {
  return PrivacyPolicy.aggregate([
    {
      $match: { isDelete: false }
    },
    {
      $project: {
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
        message: "Get All EventType  Successfully",
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

const viewSingel = async (req, res) => {
  return PrivacyPolicy.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) }
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

const DeleteP = async (req, res) => {
  return PrivacyPolicy.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: 'PrivacyPolicy delete successfully',
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
  return PrivacyPolicy.findOneAndUpdate(
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
          message: "PrivacyPolicy Delete successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "PrivacyPolicy not match",
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
  Delete,
  viewSingel
};
