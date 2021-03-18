const { sgMail, templates } = require("./emailConfig.js");
const config = require("../../../config")[process.env.NODE_ENV];

function registerEmail(to, key) {
  const clientUrl = config.clientUrl + `/register/${key}`;

  const msg = {
    to,
    from: {
      email: process.env.EMAIL,
      name: process.env.FROM_NAME,
    },
    templateId: templates.welcome,
    dynamic_template_data: {
      email: to,
      clientUrl: clientUrl,
    },
  };
  return sgMail.send(msg);
}

function confirmRegisterEmail(to) {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL,
      name: process.env.FROM_NAME,
    },
    templateId: templates.confirm_register,
    dynamic_template_data: {
      email: to,
      appUrl: config.clientUrl,
    },
  };
  return sgMail.send(msg);
}

module.exports = { registerEmail, confirmRegisterEmail };
