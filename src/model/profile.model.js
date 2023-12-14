const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    // Personal Details
    fullname: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    marital_status: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    motherTongue: {
      type: String,
      required: true,
    },
    caste: {
      type: String,
      required: true,
    },
    smokeOrDrink: {
      type: String,
      required: true,
    },

    // Family Details
    familyType: {
      type: String,
      required: true,
    },
    physicalDisability: {
      type: String,
      required: true,
    },
    gotra: {
      type: String,
      required: true,
    },
    familyValues: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    highestEducation: {
      type: String,
      required: true,
    },
    employedIn: {
      type: String,
      required: true,
    },
    income: {
      type: String,
      required: true,
    },

    // User Preferences

    preferredAge: {
      type: String,
      required: true,
    },
    preferredHeight: {
      type: String,
      required: true,
    },
    preferredMaritalStatus: {
      type: String,
      required: true,
    },
    preferredReligion: {
      type: String,
      required: true,
    },
    preferredCaste: {
      type: String,
      required: true,
    },
    preferredEducation: {
      type: String,
      required: true,
    },
    preferredOccupation: {
      type: String,
      required: true,
    },
    preferredIncome: {
      type: String,
      required: true,
    },
    preferredMotherTongue: {
      type: String,
      required: true,
    },

    ageWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    heightWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    religionWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    casteWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    annualIncomeWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    marital_statusWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    motherTongueWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    education_degreeWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    partnerMessage: {
      type: String,
    },
    hobbies: {
      type: String,
    },
    noOfFamilyMembers: {
      type: Number,
    },
    noOfSiblings: {
      type: Number,
    },
    liveWithFamily: {
      type: String,
    },
  },
  {
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  }
);

const ProfileModel = mongoose.model("Profile", ProfileSchema);

module.exports = ProfileModel;
