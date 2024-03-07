const app = require("express").Router();
const reportCtrl = require("../controllers/report.controller");
const authCheck = require("../middleware/auth.middleware");

app.post("/send", authCheck, reportCtrl.reportUser);

module.exports = app;
