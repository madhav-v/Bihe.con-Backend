const ChatModel = require("../model/chat.model");
const MessageModel = require("../model/message.model");
const UserModel = require("../model/user.model");
class MessageController {
  sendMessage = async (req, res, next) => {
    try {
      const { content, chatId } = req.body;
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        res.json({
          status: 400,
          msg: "error while sending chat",
        });
      }
      let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
      };
      try {
        let message = await MessageModel.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await UserModel.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
        await ChatModel.findByIdAndUpdate(req.body.chatId, {
          latestMessage: message,
        });
        res.json({
          status: 200,
          result: message,
          msg: "message sent",
        });
      } catch (exception) {
        next(exception);
      }
    } catch (exception) {
      next(exception);
    }
  };
  allMessages = async (req, res, next) => {
    try {
      const message = await MessageModel.find({
        chat: req.params.chatId,
      })
        .populate("sender", "name pic email")
        .populate("chat");

      res.json({
        status: 200,
        result: message,
        msg: "all messages",
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const msgCtrl = new MessageController();
module.exports = msgCtrl;
