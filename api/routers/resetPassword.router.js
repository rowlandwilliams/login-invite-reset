const express = require("express");
const {
  findUserById,
  findUserByEmail,
  createPasswordResetToken,
  setPasswordUponSuccessfulReset,
} = require("../db/users");
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const {
  passwordResetEmail,
  confirmPasswordResetEmail,
} = require("../utils/email/passwordResetEmail");
const {
  checkPasswordTokenMiddleware,
} = require("../middleware/checkPasswordToken");
const { validateCredentials } = require("../utils/validate");
const {
  loginInviteLimitMiddleware,
  userLimitMiddleware,
} = require("../middleware/rateLimit");

// all start with /reset-password as mounted in api.router.js
const resetPasswordRouter = express.Router();
// resetPasswordRouter.use(userLimitMiddleware);

resetPasswordRouter.get(
  "/:token",
  checkPasswordTokenMiddleware,
  userLimitMiddleware,
  (req, res) => {
    if (!res.locals.passwordEmail) {
      res.status(401).end();
      return;
    }
    res.json({
      message: "token is valid",
      tokenValid: true,
      userEmail: res.locals.passwordEmail,
    });
  }
);

// endpoint to post password details to
resetPasswordRouter.post(
  "/:token/set-password",
  checkPasswordTokenMiddleware,
  userLimitMiddleware,
  async (req, res) => {
    const { password, password2 } = req.body;
    const email = res.locals.passwordEmail;

    const errors = validateCredentials(email, password, password2);
    if (errors.length > 0) {
      res.status(422).json({ message: errors });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: ["No user registered"] });
      return;
    }

    // if no token exists (default value is null) send 401
    if (user.reset_token === null) {
      res
        .status(401)
        .json({ message: ["No token exists for this email address"] });
      return;
    }

    const ts = user.reset_token_expires;
    if (new Date().getTime() > ts.getTime()) {
      res.status(401).json({ message: "Token expired" });
      return;
    }

    const { id } = user;
    await setPasswordUponSuccessfulReset(id, password);

    return confirmPasswordResetEmail(user.email)
      .then(() => {
        console.log("Password confirmation email sent");
        res.status(200).json({
          message: ["Password updated"],
          success: true,
        });
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.body);
        res.status(400).json({
          message: "Error sending email. Please try again.",
        });
      });
  }
);

// endpoint to send password reset request as admin
resetPasswordRouter.use(isLoggedIn);
resetPasswordRouter.use(isAdmin);
resetPasswordRouter.post("/", loginInviteLimitMiddleware, async (req, res) => {
  const { id } = req.body;
  const user = await findUserById(id);
  if (!user) {
    res.status(404).end();
    return;
  }
  const { token: resetToken } = await createPasswordResetToken(id);
  return passwordResetEmail(user.email, resetToken)
    .then(() => {
      console.log("Email sent");
      res.status(200).json({ message: "Invite sent" });
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response.body);
      res.status(400).json({
        message:
          "Error sending email. Please try again or contact customer support.",
      });
    });
});

module.exports = resetPasswordRouter;
