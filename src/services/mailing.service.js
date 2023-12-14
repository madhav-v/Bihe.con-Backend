const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

class MailService {
  connection;
  constructor() {
    this.connection = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }
  sendMail = async (to, subject, content) => {
    try {
      let msg = {
        from: "Admin User",
        to: to,
        subject: subject,
        html: content,
      };

      let response = await this.connection.sendMail(msg);
      console.log(response);
      return true;
    } catch (exception) {
      console.log("Email Exception", exception);
    }
  };
}

const mailSvc = new MailService();
module.exports = mailSvc;
