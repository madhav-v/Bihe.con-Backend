const UserModel = require("../model/user.model");
const FeedBackModel = require("../model/feedback.model");
const mailSvc = require("../services/mailing.service");

class FeedBackController {
  sendFeedBack = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userProfile = await UserModel.findById(userId).populate("profile");
      if (!userProfile) {
        return res.status(404).json({
          status: 404,
          msg: "User not found",
        });
      }
      const { feedback, rating } = req.body;
      const newFeedback = new FeedBackModel({
        user: userId,
        feedback,
        rating,
      });
      let result = await newFeedback.save();
      if (result) {
        let email = "madhavdhungana36@gmail.com";
        let mailMsg = `Dear Sir,<br/>
        ${userProfile.name} has rated <b>${rating} stars </b> and send this feedback.<br/>
        <b>Feedback:</b> ${feedback}<br/>
        `;
        mailSvc.sendMail(email, "FeedBack Received", mailMsg);
      }
      res.json({
        status: 200,
        msg: "Feedback Sent",
      });
    } catch (exception) {
      next(exception);
    }
  };

  getFeedback = async (req, res, next) => {
    try {
      let feedbacks = await FeedBackModel.find().populate("user");
      res.json({
        status: 200,
        feedbacks,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const feedbackCtrl = new FeedBackController();
module.exports = feedbackCtrl;
