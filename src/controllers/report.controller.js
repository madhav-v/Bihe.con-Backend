const ReportModel = require("../model/report.model");
const UserModel = require("../model/user.model");
const mailSvc = require("../services/mailing.service");

class ReportController {
  reportUser = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userProfile = await UserModel.findById(userId);
      const { receiver, reason } = req.body;
      const receiverProfile = await UserModel.findById(receiver);
      const newReport = new ReportModel({
        sender: userId,
        receiver: receiver,
        reason,
      });
      let result = await newReport.save();
      if (result) {
        let email = "madhavdhungana36@gmail.com";
        let mailMsg = `Dear Sir,<br/>
      <b>${userProfile.name}</b> has reported <b>${receiverProfile.name}</b><br/>
      Reason: ${reason}.<br/>
       Please have a look at the issue.<br/>
        `;
        mailSvc.sendMail(email, "Report Received", mailMsg);
      }
    } catch (exception) {
      next(exception);
    }
  };

  getAllReports = async (req, res, next) => {
    try {
      let reports = await ReportModel.find().populate("sender receiver");
      res.status(200).json({ reports });
    } catch (exception) {
      next(exception);
    }
  };
}

const reportCtrl = new ReportController();
module.exports = reportCtrl;
