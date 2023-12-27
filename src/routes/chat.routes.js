const router = require("express").Router();
const chatCtrl = require("../controllers/chat.controller");
const authCheck = require("../middleware/auth.middleware");

router
  .route("/")
  .post(authCheck, chatCtrl.accessChat)
  .get(authCheck, chatCtrl.fetchChat);

router
  .route("/connection-requests")
  .get(authCheck, chatCtrl.getConnectionRequests);

router.route("/send-request").post(authCheck, chatCtrl.sendChatRequest);
router.route("/accept-request/:id").put(authCheck, chatCtrl.acceptChatRequest);
router.put("/reject-chat-request/:id",authCheck, chatCtrl.rejectChatRequest);


module.exports = router;
