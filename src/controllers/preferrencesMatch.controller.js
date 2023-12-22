const ProfileModel = require("../model/profile.model");
const UserModel = require("../model/user.model");
const profileSvc = require("../services/profile.service");

class PreferencesController {
  findMatchesByEducation = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }
      const profile = user.profile;
      const matchingProfiles = await ProfileModel.find({
        highestEducation: profile.preferredEducation,
        sex: profile.sex.toLowerCase() === "man" ? "woman" : "man",
      });
  
      const userIds = await UserModel.find({
        profile: { $in: matchingProfiles.map((profile) => profile._id) },
      }).select("_id");
  
      res.json({
        user: userIds.map((user) => user._id),
        result: matchingProfiles,
        msg: "Preferred Education Matches",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  
  findMatchesByOccupation = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }
      const profile = user.profile;

      const matchingProfiles = await ProfileModel.find({
        occupation: profile.preferredOccupation,
        sex: profile.sex.toLowerCase() === "man" ? "woman" : "man",
      });

      const userIds = await UserModel.find({
        profile: { $in: matchingProfiles.map((profile) => profile._id) },
      }).select("_id");
      res.json({
        user: userIds.map((user) => user._id),
        result: matchingProfiles,
        // Send an array of user IDs
        msg: "Preferred Occupation Matches",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  findMatchesByIncome = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }
      const profile = user.profile;
      const matchingProfiles = await ProfileModel.find({
        income: profile.preferredIncome,
        sex: profile.sex.toLowerCase() === "man" ? "woman" : "man",
      });
  
      const userIds = await UserModel.find({
        profile: { $in: matchingProfiles.map((profile) => profile._id) },
      }).select("_id");
  
      res.json({
        user: userIds.map((user) => user._id),
        result: matchingProfiles,
        msg: "Preferred Income Matches",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  
}

const preferenceCtrl = new PreferencesController();
module.exports = preferenceCtrl;
