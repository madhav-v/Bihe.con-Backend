const app = require("express").Router();
const feedbackCtrl = require("../controllers/feedback.controller");
const authCheck = require("../middleware/auth.middleware");

app.post("/send", authCheck, feedbackCtrl.sendFeedBack);
app.get("/get", authCheck, feedbackCtrl.getFeedback);

module.exports = app;
