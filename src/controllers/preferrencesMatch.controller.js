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
      const profile = user.profile;

      const matchingProfiles = await ProfileModel.find({
        sex: profile.sex.toLowerCase() === "man" ? "woman" : "man",
      });

      // Calculate the weighted scores for each matching profile
      const sortedMatches = matchingProfiles.map((matchProfile) => {
        const weightedScore = this.calculateWeightedScore(
          profile,
          matchProfile
        );
        return { profile: matchProfile, weightedScore };
      });

      // Sort profiles based on weighted scores
      sortedMatches.sort((a, b) => b.weightedScore - a.weightedScore);

      const userIds = sortedMatches.map((match) => match.profile.user);

      res.json({
        user: userIds,
        result: sortedMatches.map((match) => match.profile),
        msg: "Preferred Matches based on Weighted Score",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  // Function to calculate weighted score
  calculateWeightedScore(userProfile, matchProfile) {
    // Replace the placeholder code with your actual logic for calculating scores
    const ageScore = this.calculateAgeScore(userProfile, matchProfile);
    const educationScore = this.calculateEducationScore(
      userProfile,
      matchProfile
    );

    // Adjust weights according to your requirements
    const weightedScore =
      (userProfile.ageWeight * ageScore +
        userProfile.educational_degreeWeight * educationScore) /
      (userProfile.ageWeight + userProfile.educational_degreeWeight);
    console.log("wt", weightedScore);
    return weightedScore;
  }

  // Helper function for age score calculation
  calculateAgeScore(userProfile, matchProfile) {
    // Replace the placeholder code with your actual logic for calculating age score
    // Example: Calculate the absolute difference in ages and normalize it between 0 and 1
    const ageDifference = Math.abs(userProfile.age - matchProfile.age);
    const normalizedAgeDifference =
      ageDifference / (userProfile.maxAgeDifference || 1);

    // Adjust weights according to your requirements
    return 1 - normalizedAgeDifference;
  }

  // Helper function for education score calculation
  calculateEducationScore(userProfile, matchProfile) {
    // Replace the placeholder code with your actual logic for calculating education score
    // Example: Compare education levels and assign scores accordingly

    // Make sure both profiles have educationLevel property
    const userEducationLevel = userProfile.educationLevel?.toLowerCase();
    const matchEducationLevel = matchProfile.educationLevel?.toLowerCase();

    // Check if both education levels are defined before proceeding
    if (userEducationLevel && matchEducationLevel) {
      // Assign scores based on education levels
      const educationScores = {
        highschool: 0.2,
        college: 0.5,
        university: 1,
      };

      // Adjust weights according to your requirements
      return (
        (educationScores[matchEducationLevel] || 0) *
        userProfile.educationLevelWeight
      );
    } else {
      // Handle the case where either user or match profile doesn't have educationLevel
      // You can return a default value, throw an error, or handle it as needed
      return 0;
    }
  }
}

const preferenceCtrl = new PreferencesController();
module.exports = preferenceCtrl;
