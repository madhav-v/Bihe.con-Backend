const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const userSvc = require("../services/user.service");

const authCheck = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers["authorization"]) {
      token = req.headers["authorization"];
    }
    if (req.headers["x-xsrf-token"]) {
      token = req.headers["x-xsrf-token"];
    }
    if (req.query["token"]) {
      token = req.query["token"];
    }
    if (!token || token === "" || token === null) {
      next({ status: 401, msg: "Please Login First" });
    } else {
      token = token.split(" ").pop();
      if (!token) {
        next({ status: 401, msg: "Token not set" });
      }
      let data = jwt.verify(token, process.env.JWT_SECRET);
      let user = await userSvc.getUserById(data.id);
      if (user) {
        req.user = user;
        next();
      } else {
        next({ status: 401, msg: "Invalid Token" });
      }
    }
  } catch (exception) {
    next(exception);
  }
};

module.exports = authCheck;
