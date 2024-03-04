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
      const { feedback } = req.body;
      const newFeedback = new FeedBackModel({
        user: userId,
        feedback,
      });
      let result = await newFeedback.save();
      if (result) {
        let email = "madhavdhungana36@gmail.com";
        let mailMsg = `Dear Sir,<br/>
        ${userProfile.name} has send this feedback.<br/>
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
}

const feedbackCtrl = new FeedBackController();
module.exports = feedbackCtrl;
