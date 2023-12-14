const profileSvc = require("../services/profile.service");
const UserModel = require("../model/user.model");
const ProfileModel = require("../model/profile.model");
class ProfileController {
  createProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const user = await UserModel.findById(userId).populate("profile");
      if (user.profile) {
        throw { status: 400, msg: "User already has a profile." };
      }
      let data = req.body;
      let response = await profileSvc.createProfile(data);
      await UserModel.findByIdAndUpdate(userId, { profile: response._id });
      res.json({
        result: response,
        msg: "Profile Created",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      let data = req.body;
      let id = req.params.id;
      let profile = await profileSvc.getProfileById(id);
      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = profile.image;
      }
      profileSvc.validateProfile(data);
      let response = await profileSvc.updateProfile(id, data);
      res.json({
        result: response,
        msg: "Profile Updated",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  deleteProfile = async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await profileSvc.deleteProfile(id);
      res.json({
        result: response,
        msg: "Profile Deleted",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  listAllProfile = async (req, res, next) => {
    try {
      let response = await profileSvc.getAllProfiles();
      res.json({
        result: response,
        msg: "Profile Fetched",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getProfileById = async (req, res, next) => {
    try {
      let id = req.params.id;
      let response = await profileSvc.getProfileById(id);
      res.json({
        result: response,
        msg: "Profile Fetched",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  createBio = async (req, res, next) => {
    try {
      const bio = req.body.bio;
      const id = req.user?.id;
      const user = await UserModel.findById(id);
      const profile = await ProfileModel.findById(user.profile);
      if (!bio) {
        throw { status: 404, msg: "Please provide Bio" };
      }
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }
      if (user.profile) {
        profile.bio = bio;
        await profile?.save();
      }
      res.json({
        result: user,
        msg: "Bio Created",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  firstEdit = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const data = req.body;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }

      const profile = user.profile;
      profile.fullname = data.fullname;
      profile.sex = data.sex;
      profile.dateOfBirth = data.dateOfBirth;
      profile.marital_status = data.marital_status;
      profile.motherTongue = data.motherTongue;
      profile.smokeOrDrink = data.smokeOrDrink;
      profile.caste = data.caste;
      profile.religion = data.religion;
      profile.address = data.address;

      await profile?.save();
      const updatedUser = await UserModel.findById(id).populate("profile");

      res.json({
        result: updatedUser,
        msg: "First Edit",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  secondEdit = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const data = req.body;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }

      const profile = user.profile;
      profile.income = data.income;
      profile.highestEducation = data.highestEducation;
      profile.occupation = data.occupation;
      profile.physicalDisability = data.physicalDisability;
      profile.employedIn = data.employedIn;
      profile.gotra = data.gotra;
      profile.familyType = data.familyType;
      profile.familyValues = data.familyValues;
      profile.noOfFamilyMembers = data.noOfFamilyMembers;
      profile.noOfSiblings = data.noOfSiblings;
      profile.liveWithFamily = data.liveWithFamily;

      await profile?.save();
      const updatedUser = await UserModel.findById(id).populate("profile");

      res.json({
        result: updatedUser,
        msg: "First Edit",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  thirdEdit = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const data = req.body;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }

      const profile = user.profile;
      profile.preferredReligion = data.preferredReligion;
      profile.preferredMaritalStatus = data.preferredMaritalStatus;
      profile.preferredAge = data.preferredAge;
      profile.preferredHeight = data.preferredHeight;
      profile.preferredCaste = data.preferredCaste;
      profile.preferredMotherTongue = data.preferredMotherTongue;
      profile.preferredFamilyValues = data.preferredFamilyValues;
      profile.preferredEducation = data.preferredEducation;
      profile.preferredOccupation = data.preferredOccupation;
      profile.preferredIncome = data.preferredIncome;

      await profile?.save();
      const updatedUser = await UserModel.findById(id).populate("profile");

      res.json({
        result: updatedUser,
        msg: "First Edit",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  addPhoto = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }
      const data = {
        filename: req.file.filename,
      };
      const profile = user.profile;
      profile.image = data.filename;
      await profile?.save();
      const updatedUser = await UserModel.findById(id).populate("profile");

      res.json({
        result: updatedUser,
        msg: "Profile Updated",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  addHobbies = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const data = req.body;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }

      const profile = user.profile;
      profile.hobbies = data.hobbies;
      await profile?.save();
      const updatedUser = await UserModel.findById(id).populate("profile");

      res.json({
        result: updatedUser,
        msg: "Profile Updated",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  partnerMessage = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const data = req.body;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }

      const profile = user.profile;
      profile.partnerMessage = data.partnerMessage;
      await profile?.save();
      const updatedUser = await UserModel.findById(id).populate("profile");

      res.json({
        result: updatedUser,
        msg: "Profile Updated",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const profileCtrl = new ProfileController();
module.exports = profileCtrl;
