const ProfileModel = require("../model/profile.model");
const UserModel = require("../model/user.model");
const profileSvc = require("../services/profile.service");
// const { normalize } = require("lodash");

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

  // findMatchesByWeightedScore = async (req, res, next) => {
  //   // Assuming you have already defined normalize, calculateWeightedScore, and calculateTotalScore functions

  //   // Add logging for debugging
  //   try {
  //     const id = req.user?.id;
  //     const user = await UserModel.findById(id).populate("profile");

  //     if (!user.profile) {
  //       throw { status: 400, msg: "User does not have a profile." };
  //     }

  //     const userProfile = user.profile;

  //     // Fetch the profiles of the opposite sex
  //     const matchingProfiles = await ProfileModel.find({
  //       sex: userProfile.sex.toLowerCase() === "man" ? "woman" : "man",
  //     });

  //     // Assuming 'userProfile' and 'matchingProfiles' are available

  //     // Define criteria and their weights
  //     const criteria = [
  //       {
  //         field: "age",
  //         weight: userProfile.ageWeight,
  //         preference: userProfile.preferredAge,
  //       },
  //       {
  //         field: "height",
  //         weight: userProfile.heightWeight,
  //         preference: userProfile.preferredHeight,
  //       },
  //       {
  //         field: "religion",
  //         weight: userProfile.religionWeight,
  //         preference: userProfile.preferredReligion,
  //       },
  //       // Add other criteria...
  //     ];
  //     function calculateTotalScore(weightedScores) {
  //       return weightedScores.reduce((sum, score) => sum + score, 0);
  //     }
  //     function calculateWeightedScore(normalizedScore, weight) {
  //       return normalizedScore * weight;
  //     }
  //     function normalize(value, min, max) {
  //       return (value - min) / (max - min);
  //     }
  //     // Calculate normalized scores for all criteria
  //     const normalizedScores = matchingProfiles.map((profile) => {
  //       const profileScores = criteria.map((criterion) => {
  //         const userPreference = criterion.preference;
  //         const userValue = userProfile[criterion.field];
  //         const matchedValue = profile[criterion.field];
  //         const normalizedScore = userValue === matchedValue ? 1 : 0;
  //         return normalize(normalizedScore, 0, 1) * criterion.weight;
  //       });

  //       // Calculate total score for each profile
  //       const totalScore = calculateTotalScore(profileScores);

  //       return { profile, totalScore };
  //     });

  //     // Sort matching profiles by total score in descending order
  //     const sortedProfiles = normalizedScores.sort(
  //       (a, b) => b.totalScore - a.totalScore
  //     );

  //     // Now 'sortedProfiles' contains matching profiles sorted by their total score.
  //     res.json(sortedProfiles);
  //   } catch (exception) {
  //     next(exception);
  //   }
  // };

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

      let weights = {
        age: userProfile.ageWeight,
        height: userProfile.heightWeight,
        religion: userProfile.religionWeight,
        caste: userProfile.casteWeight,
        education: userProfile.education_degreeWeight,
        motherTongue: userProfile.motherTongueWeight,
        income: userProfile.annualIncomeWeight,
        marital_status: userProfile.marital_statusWeight,
      };

      const predefinedWeights = {
        age: 0.2,
        height: 0.3,
        religion: 0.25,
        caste: 0.25,
        education: 0.4,
        motherTongue: 0.2,
        income: 0.3,
        marital_status: 0.4,
      };

      let updatedWeights = {
        age: weights.age ? weights.age : predefinedWeights.age,
        height: weights.height ? weights.height : predefinedWeights.height,
        religion: weights.religion
          ? weights.religion
          : predefinedWeights.religion,
        caste: weights.caste ? weights.caste : predefinedWeights.caste,
        education: weights.education
          ? weights.education
          : predefinedWeights.education,
        motherTongue: weights.motherTongue
          ? weights.motherTongue
          : predefinedWeights.motherTongue,
        income: weights.income ? weights.income : predefinedWeights.income,
        marital_status: weights.marital_status
          ? weights.marital_status
          : predefinedWeights.marital_status,
      };

      const normalizedScores = matchingProfiles.map((profile) => {
        const profileScores = Object.keys(updatedWeights).map((criterion) => {
          const userValue = userProfile[criterion];
          const profileValue = profile[criterion];
          const score = userValue === profileValue ? 1 : 0;
          const normalizedScore = normalize(score, 0, 1);
          return normalizedScore * updatedWeights[criterion];
        });

        const totalScore = calculateTotalScore(profileScores);

        return { profile, totalScore };
      });

      function calculateTotalScore(weightedScores) {
        return weightedScores.reduce((sum, score) => sum + score, 0);
      }

      function normalize(value, min, max) {
        return (value - min) / (max - min);
      }

      const sortedProfiles = normalizedScores.sort(
        (a, b) => b.totalScore - a.totalScore
      );

      const profileResults = sortedProfiles.map(({ profile }) => profile);

      res.json({
        result: profileResults,
        msg: "Algorithm Matches",
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
