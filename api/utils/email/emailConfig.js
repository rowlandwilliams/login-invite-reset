const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const templates = {
  password_reset: process.env.SENDGRID_PASSWORD_RESET,
  welcome: process.env.SENDGRID_WELCOME,
  confirm_password_reset: process.env.SENDGRID_PASSWORD_RESET_CONFIRM,
  confirm_register: process.env.SENDGRID_REGISTER_CONFIRM,
};

module.exports = { sgMail, templates };
