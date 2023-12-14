const router = require("express").Router();
const authCheck = require("../middleware/auth.middleware");
const msgCtrl = require("../controllers/message.controller")

router.route("/")
.post(authCheck,msgCtrl.sendMessage)

router.route("/:chatId").get(authCheck,msgCtrl.allMessages)


module.exports = router