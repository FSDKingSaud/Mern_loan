const nodemailer = require("nodemailer");
const Settings = require("../models/Settings");
const defaultEmailConfig = require("../config/email");

const sendEmail = async ({ email, text, html, subject }) => {
  const password = process.env.EMAIL_PASSWORD;

  const emailConfig = await Settings.findOne({});

  const host = emailConfig.smptHost || defaultEmailConfig.smptHost;
  const port = emailConfig.smtpPort || defaultEmailConfig.smtpPort;
  const user = emailConfig.smtpUsername || defaultEmailConfig.smtpUsername;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port == 465 ? true : false,
    auth: {
      user,
      pass: password,
    },
  });


  const mailOptions = {
    from: `"${emailConfig.fromName || defaultEmailConfig.fromName}" <${
      emailConfig.fromEmail || defaultEmailConfig.fromEmail
    }>`,
    to: email,
    subject,
    html,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return true;
  });
};

module.exports = sendEmail;
