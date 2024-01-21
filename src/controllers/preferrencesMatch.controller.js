const ProfileModel = require("../model/profile.model");
const UserModel = require("../model/user.model");
const profileSvc = require("../services/profile.service");
const helpers = require("../utilities/helpers");

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
        // preferredAge: {
        //   $lte: userProfile.preferredAge.split("-")[1],
        //   $gte: userProfile.preferredAge.split("-")[0],
        // },
        // preferredHeight: {
        //   $lte: helpers.calculateProfileHeight(userProfile.preferredHeight),
        // },
      });
      const userIds = await UserModel.find({
        profile: { $in: matchingProfiles.map((profile) => profile._id) },
      }).select("_id");

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
        age: 0.3,
        height: 0.2,
        religion: 0.3,
        caste: 0.3,
        education: 0.25,
        motherTongue: 0.25,
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
          let score;
          if (criterion === "age") {
            const userAge = helpers.calculateProfileAge(userValue);
            const profileAge = helpers.calculateProfileAge(profileValue);
            score = userAge === profileAge ? 1 : 0;
          } else if (criterion === "height") {
            const userHeight = helpers.calculateProfileHeight(userValue);
            const profileHeight = helpers.calculateProfileHeight(profileValue);
            score = userHeight === profileHeight ? 1 : 0;
          } else {
            score = userValue === profileValue ? 1 : 0;
          }

          const normalizedScore = helpers.normalize(score, 0, 1);
          return normalizedScore * updatedWeights[criterion];
        });

        const totalScore = helpers.calculateTotalScore(profileScores);

        return { profile, totalScore };
      });

      const sortedProfiles = normalizedScores.sort(
        (a, b) => b.totalScore - a.totalScore
      );
      const topMatches = sortedProfiles.slice(0, 6);
      const finalScore = topMatches.map(({ totalScore }) => totalScore);
      const profileResults = topMatches.map(({ profile }) => profile);
      res.json({
        result: profileResults,
        user: userIds.map((user) => user._id),
        score: finalScore,
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
