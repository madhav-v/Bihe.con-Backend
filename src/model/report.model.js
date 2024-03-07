const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reason: {
    type: String,
    required: true,
  },
});

const ReportModel = mongoose.model("Report", ReportSchema);
module.exports = ReportModel;
