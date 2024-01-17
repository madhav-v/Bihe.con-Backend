const app = require("express").Router();
const authCtrl = require("../controllers/auth.controller");
const authCheck = require("../middleware/auth.middleware");

app.post("/login", authCtrl.login);
app.post("/register", authCtrl.register);
app.post("/forget-password", authCtrl.forgetPassword);
app.post("/password-reset", authCtrl.resetPassword);
app.delete("/delete-user/:id", authCtrl.deleteUser);
app.get("/me", authCheck, authCtrl.getLoggedInUser);
app.get("/me/profile", authCheck, authCtrl.getUserWithProfile);
app.get("/user/:id",authCheck, authCtrl.getUserProfileById);

module.exports = app;
