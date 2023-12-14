const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const userSvc = require("../services/user.service");
const mailSvc = require("../services/mailing.service");
const helpers = require("../utilities/helpers");
const UserModel = require("../model/user.model");
const ProfileModel = require("../model/profile.model");

class AuthController {
  register = async (req, res, next) => {
    try {
      let registerData = req.body;
      userSvc.validateData(registerData);
      let user = await userSvc.registerUser(registerData);
      // if (user) {
      //   let mailMsg = `Dear ${registerData.name},<br/>
      //   Your account has been successfully registered.<br/>
      //   Regards<br/>
      //   No-Reply,Admin
      //   `;
      //   await mailSvc.sendMail(
      //     registerData.email,
      //     "Registration Success",
      //     mailMsg
      //   );
      // }
      res.json({
        status: 200,
        msg: "User Registered Successfully",
        user: user,
      });
    } catch (exception) {
      next(exception);
    }
  };
  login = async (req, res, next) => {
    try {
      let payload = req.body;
      if (!payload.email || !payload.password) {
        next({ status: 400, msg: "Credentials Required" });
      }
      let userDetail = await userSvc.getUserByEmail(payload.email);
      if (!userDetail) {
        next({ status: 400, msg: "User not found" });
        return;
      }
      if (userDetail.password !== payload.password) {
        next({ status: 400, msg: "Invalid Credentials" });
        return;
      }
      let token = jwt.sign({ id: userDetail._id }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      });

      res.json({
        status: 200,
        msg: "Login Success",
        user: userDetail,
        token: token,
      });
    } catch (exception) {
      next(exception);
    }
  };
  forgetPassword = async (req, res, next) => {
    try {
      console.log("Received forgetPassword request");
      const { email } = req.body;

      if (!email) {
        throw { status: 400, msg: "Email is required" };
      }

      const user = await userSvc.getUserByEmail(email);
      if (!user) {
        throw { status: 404, msg: "User not found" };
      }

      const resetToken = helpers.generateRandomString();

      await userSvc.updateUser({ resetToken }, user._id);

      const mailMsg = `Dear ${user.name},<br/>To reset your password, follow the link:  
                    <a href="${process.env.BASE_URL}/setPassword/${resetToken}">${process.env.BASE_URL}/set-password/${resetToken}</a>
                    <br/>
                    Regards,<br>
                    No-Reply, Admin
                    `;

      await mailSvc.sendMail(user.email, "Reset Your Password", mailMsg);

      res.json({
        result: {},
        msg: "Reset Password email sent successfully",
        status: true,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
  resetPassword = async (req, res, next) => {
    try {
      const { password, email } = req.body;
      if (!password || !email) {
        throw { status: 400, msg: "All fields are required" };
      }
      if (password.length < 6) {
        throw {
          status: 400,
          msg: "Password should be at least 8 characters long",
        };
      }
      const user = await userSvc.getUserByEmail(email);
      if (!user) {
        throw { status: 404, msg: "User not found" };
      }

      await userSvc.updateUser({ password: password }, user._id);
      res.json({
        status: 200,
        msg: "Password updated successfully",
      });
    } catch (exception) {
      next(exception);
    }
  };
  deleteUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw { status: 400, msg: "User id is required" };
      }
      const user = await userSvc.getUserById(id);
      if (!user) {
        throw { status: 404, msg: "User not found" };
      }
      await userSvc.deleteUser(id);
      res.json({
        status: 200,
        msg: "User deleted successfully",
      });
    } catch (exception) {
      next(exception);
    }
  };
  getLoggedInUser = async (req, res, next) => {
    try {
      res.json({
        result: req.user,
        msg: "Your Detail",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getUserWithProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userProfile = await UserModel.findById(userId).populate("profile");

      if (!userProfile) {
        return res.status(404).json({
          status: 404,
          msg: "User not found",
        });
      }

      res.json({
        status: 200,
        msg: "User and profile data",
        result: userProfile,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
