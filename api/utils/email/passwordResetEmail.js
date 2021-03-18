const { sgMail, templates } = require("./emailConfig");
const config = require("../../../config")[process.env.NODE_ENV];

function passwordResetEmail(to, resetToken) {
  const passwordUrl = config.clientUrl + `/reset-password/${resetToken}`;

  const msg = {
    to,
    from: {
      email: process.env.EMAIL,
      name: process.env.FROM_NAME,
    },
    templateId: templates.password_reset,
    dynamic_template_data: {
      email: to,
      passwordUrl: passwordUrl,
    },
  };
  return sgMail.send(msg);
}

function confirmPasswordResetEmail(to) {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL,
      name: process.env.FROM_NAME,
    },
    templateId: templates.confirm_password_reset,
    dynamic_template_data: {
      email: to,
      appUrl: config.clientUrl,
    },
  };
  return sgMail.send(msg);
}

module.exports = { passwordResetEmail, confirmPasswordResetEmail };
