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

  findMatchesByWeightedScore = async (req, res, next) => {
    try {
      const id = req.user?.id;
      const user = await UserModel.findById(id).populate("profile");
      if (!user.profile) {
        throw { status: 400, msg: "User does not have a profile." };
      }

      const userProfile = user.profile;
      const matchingProfiles = await ProfileModel.find({
        sex: userProfile.sex.toLowerCase() === "man" ? "woman" : "man",
      });

      function calculateWeightedScore(userProfile, matchProfile) {
        let weightedScore = 0;
        weightedScore +=
          userProfile.ageWeight *
          calculateScoreForAge(userProfile, matchProfile);
        weightedScore +=
          userProfile.heightWeight *
          calculateScoreForHeight(userProfile, matchProfile);
        weightedScore +=
          userProfile.religionWeight *
          calculateScoreForReligion(userProfile, matchProfile);
        weightedScore +=
          userProfile.casteWeight *
          calculateScoreForCaste(userProfile, matchProfile);
        weightedScore +=
          userProfile.annualIncomeWeight *
          calculateScoreForIncome(userProfile, matchProfile);
        weightedScore +=
          userProfile.marital_statusWeight *
          calculateScoreForMaritalStatus(userProfile, matchProfile);
        weightedScore +=
          userProfile.motherTongueWeight *
          calculateScoreForMotherTongue(userProfile, matchProfile);
        weightedScore +=
          userProfile.education_degreeWeight *
          calculateScoreForEducation(userProfile, matchProfile);
        return weightedScore;
      }

      function calculateScoreForAge(userProfile, matchProfile) {
        const ageDifference = Math.abs(
          parseInt(userProfile.dateOfBirth) - parseInt(matchProfile.dateOfBirth)
        );
        const maxAgeDifference = 10;
        const ageScore = 1 - Math.min(1, ageDifference / maxAgeDifference);
        console.log("age score", ageScore);
        return ageScore;
      }

      function calculateScoreForHeight(userProfile, matchProfile) {
        const heightDifference = Math.abs(
          parseInt(userProfile.height) - parseInt(matchProfile.height)
        );
        const maxHeightDifference = 10;
        const heightScore =
          1 - Math.min(1, heightDifference / maxHeightDifference);
        console.log("height score", heightScore);
        return heightScore;
      }

      function calculateScoreForReligion(userProfile, matchProfile) {
        return userProfile.religion === matchProfile.religion ? 1 : 0;
      }

      function calculateScoreForCaste(userProfile, matchProfile) {
        return userProfile.caste === matchProfile.caste ? 1 : 0;
      }

      function calculateScoreForIncome(userProfile, matchProfile) {
        const userIncome = parseInt(userProfile.income);
        const matchIncome = parseInt(matchProfile.income);
        const incomeDifference = Math.abs(userIncome - matchIncome);
        const maxIncomeDifference = 50000;
        const incomeScore =
          1 - Math.min(1, incomeDifference / maxIncomeDifference);
        console.log("income score", incomeScore);
        return incomeScore;
      }
      function calculateScoreForMaritalStatus(userProfile, matchProfile) {
        return userProfile.marital_status === matchProfile.marital_status
          ? 1
          : 0;
      }

      function calculateScoreForMotherTongue(userProfile, matchProfile) {
        return userProfile.motherTongue === matchProfile.motherTongue ? 1 : 0;
      }

      function calculateScoreForEducation(userProfile, matchProfile) {
        return userProfile.highestEducation === matchProfile.highestEducation
          ? 1
          : 0;
      }
      const compatibleMatches = matchingProfiles
        .map((matchProfile) => ({
          profile: matchProfile,
          score: calculateWeightedScore(userProfile, matchProfile),
        }))
        .sort((a, b) => b.score - a.score);

      const N = 10;
      const topMatches = compatibleMatches.slice(0, N);
      res.json({ topMatches });
    } catch (exception) {
      next(exception);
    }
  };
}

const preferenceCtrl = new PreferencesController();
module.exports = preferenceCtrl;
