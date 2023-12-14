const app = require("express").Router();
const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const chatRoutes = require("./chat.routes");
const messageRoutes = require("./message.routes");

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

module.exports = app;
