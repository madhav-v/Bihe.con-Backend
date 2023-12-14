const UserModel = require("../model/user.model");

class UserService {
  validateData = (data) => {
    if (!data.name) {
      throw { status: 400, msg: "Name Required" };
    }
    if (!data.email) {
      throw { status: 400, msg: "Email Required" };
    }
    if (!data.password) {
      throw { status: 400, msg: "Password Required" };
    }
  };
  registerUser = async (data) => {
    try {
      let user = new UserModel(data);
      return await user.save();
    } catch (exception) {
      throw exception;
    }
  };
  getUserByEmail = async (email) => {
    try {
      let user = await UserModel.findOne({
        email: email,
      });
      if (user) {
        return user;
      } else {
        throw "User Doesn't Exists";
      }
    } catch (exception) {
      throw exception;
    }
  };
  getUserById = async (id) => {
    try {
      let userDetail = await UserModel.findById(id);
      return userDetail;
    } catch (exception) {
      throw exception;
    }
  };
  updateUser = async (data, id) => {
    try {
      let userDetail = await UserModel.findByIdAndUpdate(id, { $set: data });
      return userDetail;
    } catch (exception) {
      throw exception;
    }
  };
  deleteUser = async (id) => {
    try {
      let userDetail = await UserModel.findByIdAndDelete(id);
      return userDetail;
    } catch (exception) {
      throw exception;
    }
  };
}

const userSvc = new UserService();
module.exports = userSvc;
