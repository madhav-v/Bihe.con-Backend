const mongoose = require("mongoose");

const FeedBackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  feedback: {
    type: String,
    required: true,
  },
});

const FeedBackModel = mongoose.model("FeedBack", FeedBackSchema);
module.exports = FeedBackModel;
