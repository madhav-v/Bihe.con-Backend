const app = require("express").Router();
const reportCtrl = require("../controllers/report.controller");
const authCheck = require("../middleware/auth.middleware");

app.post("/send", authCheck, reportCtrl.reportUser);
app.get("/all", authCheck, reportCtrl.getAllReports);

module.exports = app;
