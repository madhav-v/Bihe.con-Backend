const router = require("express").Router();
const chatCtrl = require("../controllers/chat.controller");
const authCheck = require("../middleware/auth.middleware");

router
  .route("/")
  .post(authCheck, chatCtrl.accessChat)
  .get(authCheck, chatCtrl.fetchChat);

module.exports = router;
