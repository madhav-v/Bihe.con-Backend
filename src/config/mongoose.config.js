const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    autoCreate: true,
    autoIndex: true,
  })
  .then((conn) => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error Connecting Database");
  });
