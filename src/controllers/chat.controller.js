const ChatModel = require("../model/chat.model");
const ChatRequestModel = require("../model/chatRequest.model");
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
        select: "name email",
      });
      if (isChat.length > 0) {
        res.json({
          status: 200,
          result: isChat[0],
          msg: "Chat Accessed",
        });
      } else {
        let chatData = {
          chatName: "sender",
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
      const results = await ChatModel.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate({
          path: "users",
          select: "-password",
          populate: {
            path: "profile",
          },
        })
        .populate("latestMessage")
        .sort({ updateAt: -1 });

      res.json({
        result: results,
        status: true,
        msg: "Chat Fetched",
      });
    } catch (exception) {
      next(exception);
    }
  };

  sendChatRequest = async (req, res, next) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw { status: 400, msg: "User Id is required" };
      }

      const acceptedStatuses = ["pending", "rejected", "accepted"];

      const existingRequest = await ChatRequestModel.findOne({
        sender: req.user._id,
        receiver: userId,
        status: { $in: acceptedStatuses },
      });

      if (existingRequest) {
        res.json({
          status: false,
          result: null,
          msg: "Request already sent or accepted",
        });
      } else {
        const newRequest = {
          sender: req.user._id,
          receiver: userId,
        };

        const request = await ChatRequestModel.create(newRequest);
        res.json({
          status: true,
          result: request,
          msg: "Request sent",
        });
      }
    } catch (exception) {
      next(exception);
    }
  };

  acceptChatRequest = async (req, res, next) => {
    try {
      const { id } = req.params;

      const request = await ChatRequestModel.findById(id).populate("sender");
      if (!request) {
        throw { status: 404, msg: "Request not found" };
      }
      if (
        request.status === "accepted" ||
        request.status === "pending" ||
        request.status === "rejected"
      ) {
        res.json({
          status: false,
          result: null,
          msg: "Request already accepted",
        });
        return;
      }
      request.status = "accepted";
      await request.save();

      res.json({
        status: true,
        result: request,
        msg: "Chat Request Accepted",
      });
    } catch (exception) {
      next(exception);
    }
  };
  rejectChatRequest = async (req, res, next) => {
    try {
      const { id } = req.params;

      const request = await ChatRequestModel.findById(id).populate("sender");
      if (!request) {
        throw { status: 404, msg: "Request not found" };
      }
      if (request.status === "rejected") {
        res.json({
          status: false,
          result: null,
          msg: "Request already rejected",
        });
        return;
      }
      request.status = "rejected";
      await request.save();

      res.json({
        status: true,
        result: request,
        msg: "Chat Request Rejected",
      });
    } catch (exception) {
      next(exception);
    }
  };

  getConnectionRequests = async (req, res, next) => {
    try {
      // console.log(req.user._id);
      const requests = await ChatRequestModel.find({
        receiver: req.user._id,
        status: "pending",
      }).populate({
        path: "sender",
        populate: {
          path: "profile",
        },
      });

      res.json({
        status: true,
        result: requests,
        msg: "Connection Requests",
      });
    } catch (exception) {
      console.error("Error fetching connection requests:", exception);
      next(exception);
    }
  };
  getSentChatRequests = async (req, res, next) => {
    try {
      const sentRequests = await ChatRequestModel.find({
        sender: req.user._id,
        status: { $in: ["pending", "rejected", "accepted"] },
      }).populate({
        path: "receiver",
        populate: {
          path: "profile",
        },
      });

      res.json({
        status: true,
        result: sentRequests,
        msg: "Sent Chat Requests",
      });
    } catch (exception) {
      console.error("Error fetching sent chat requests:", exception);
      next(exception);
    }
  };
}

const chatCtrl = new ChatController();
module.exports = chatCtrl;
