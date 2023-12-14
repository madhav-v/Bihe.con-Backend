const ProfileModel = require("../model/profile.model");
const Joi = require("joi");
class ProfileService {
  validateProfile = async (data) => {
    try {
      let schema = Joi.object({
        fullName: Joi.string().required(),
        height: Joi.string().required(),
        religion: Joi.string().required(),
        sex: Joi.string().required(),
        caste: Joi.string().required(),
        maritalStatus: Joi.string().required(),
        dateOfBirth: Joi.string().required(),
        physicalDisability: Joi.string().required(),
        address: Joi.string().required(),
        smokeOrDrink: Joi.string().required(),
        image: Joi.string().required(),

        familyType: Joi.string().required(),
        numberOfSiblings: Joi.number().required(),
        numberOfFamilyMembers: Joi.number().required(),
        gotra: Joi.string().required(),
        parentalStatus: Joi.string().required(),
        familyAddress: Joi.string().required(),
        familyValue: Joi.string().required(),
        motherTongue: Joi.string().required(),

        educationalDegree: Joi.string().required(),
        college: Joi.string().required(),
        occupation: Joi.string().required(),
        sector: Joi.string().required(),
        annualIncome: Joi.string().required(),
        companyName: Joi.string().required(),

        minAge: Joi.number().required(),
        maxAge: Joi.number().required(),
        minHeight: Joi.string().required(),
        maxHeight: Joi.string().required(),
        preferredMaritalStatus: Joi.string().required(),
        preferredReligion: Joi.string().required(),
        preferredCaste: Joi.string().required(),
        preferredEducation: Joi.string().required(),
        preferredOccupation: Joi.string().required(),
        preferredAnnualIncome: Joi.string().required(),
        preferredSector: Joi.string().required(),
        preferredMotherTongue: Joi.string().required(),
      });
      let response = schema.validate(data);
      if (response.error) {
        let msg = response.error.details[0].message;
        throw { status: 400, msg: msg };
      }
      return response.value;
    } catch (exception) {
      throw exception;
    }
  };
  createProfile = async (profile) => {
    try {
      const profileModel = new ProfileModel(profile);
      const createdProfile = await profileModel.save();
      return createdProfile;
    } catch (error) {
      throw error;
    }
  };

  getProfileById = async (profileId) => {
    try {
      const profile = await ProfileModel.findById(profileId);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  getAllProfiles = async () => {
    try {
      const profiles = await ProfileModel.find();
      return profiles;
    } catch (error) {
      throw error;
    }
  };

  updateProfile = async (profileId, data) => {
    try {
      const updatedProfile = await ProfileModel.findByIdAndUpdate(profileId, {
        $set: data,
      });
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  };

  deleteProfile = async (profileId) => {
    try {
      await ProfileModel.findByIdAndDelete(profileId);
      return;
    } catch (error) {
      throw error;
    }
  };
}

const profileSvc = new ProfileService();
module.exports = profileSvc;
