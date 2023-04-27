var mongoose = require("mongoose");
const Reviews = require("../../Models/eventReviews");

const viewAll = async (req, res) => {
  return Reviews.aggregate([
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
        message: "Get All Reviews Successfully",
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

const viewAllByEvent = async (req, res) => {
    return Reviews.aggregate([
      {
        $match: { isDelete: false }
      },
      {
        $match: { eventId: mongoose.Types.ObjectId(req.params.eventId) },
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
          message: "Get All Reviews Successfully",
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
  return Reviews.findOneAndUpdate(
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
          message: "EventType Delete successful",
          data: data,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "EventType not match",
          data: null,
        });
      }
    }
  );
}

module.exports = {
  viewAll,
  Delete,
  viewAllByEvent
};
