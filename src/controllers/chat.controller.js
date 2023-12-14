const ChatModel = require("../model/chat.model");
const UserModel = require("../model/user.model");
class ChatController {
  accessChat = async (req, res, next) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw { status: 400, msg: "User Id is required" };
      }
      let isChat = await ChatModel.find({
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      if (isChat.length > 0) {
        res.json({
          status: 200,
          result: isChat[0],
          msg: "Chat Accessed",
        });
      } else {
        let chatData = {
          chatNamea: "sender",
          users: [req.user._id, userId],
        };
        try {
          const createdChat = await ChatModel.create(chatData);
          const FullChat = await ChatModel.findOne({
            _id: createdChat._id,
          }).populate("users", "-password");

          res.json({
            status: true,
            result: FullChat,
            msg: "Chat Message",
          });
        } catch (exception) {}
      }
    } catch (exception) {
      next(exception);
    }
  };
  fetchChat = async (req, res, next) => {
    try {
      ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updateAt: -1 })
        .then(async (results) => {
          results = await UserModel.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.json({
            result: results,
            status: true,
            msg: "Chat Fetched",
          });
        });
    } catch (exception) {
      next(exception);
    }
  };
}

const chatCtrl = new ChatController();
module.exports = chatCtrl;
