const express = require("express");
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const { createUser, findUserByEmail } = require("../db/users");
const { markInviteUsed, createInviteToken } = require("../db/invites");
const {
  registerEmail,
  confirmRegisterEmail,
} = require("../utils/email/registerEmail");
const { checkInviteTokenMiddleware } = require("../middleware/checkToken");
const { validateRegisterCredentials } = require("../utils/validate");
const validator = require("validator");
const {
  loginInviteLimitMiddleware,
  userLimitMiddleware,
} = require("../middleware/rateLimit");

const inviteRouter = express.Router();

// 100 req per hour
inviteRouter.use(userLimitMiddleware);

// check token sent in email, if correct send back tokenValid which renders register form
inviteRouter.get(
  "/secret-register/:token",
  checkInviteTokenMiddleware,
  (req, res) => {
    // this check is probably unnecessary since we do this check in checkInviteTokenMiddleware
    // but figured I would add it just in case
    if (!res.locals.tokenInfo || !res.locals.tokenInfo.email) {
      res.status(401).end();
      return;
    }

    res.json({
      message: "token is valid",
      tokenValid: true,
      userEmail: res.locals.tokenInfo.email,
    });
  }
);

// endpoint for posting register details after token is verified
// token needs to not have been used to post to here
inviteRouter.post(
  "/create-secret-register/:token",
  checkInviteTokenMiddleware,
  async (req, res) => {
    const { password, password2 } = req.body;
    const firstName = validator.escape(req.body.firstName);
    const lastName = validator.escape(req.body.lastName);

    const { email } = res.locals.tokenInfo;
    const { token: inviteToken } = req.params;

    const errors = validateRegisterCredentials(
      firstName,
      lastName,
      email,
      password,
      password2
    );
    if (errors.length > 0) {
      res.status(422).json({ message: errors });
      return;
    }

    const user = await findUserByEmail(email);
    if (user) {
      res.status(400).json({ message: ["User Already Exists"] });
      return;
    }

    await createUser({ firstName, lastName, email, password });
    await markInviteUsed(inviteToken);

    console.log(email);

    return confirmRegisterEmail(email)
      .then(() => {
        console.log(`Registration confirmation email sent to ${email}`);
        res.status(200).json({
          message: ["Registration confirmed"],
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

// 20 req per hour
inviteRouter.use(isLoggedIn);
inviteRouter.use(isAdmin);
inviteRouter.use(loginInviteLimitMiddleware);

// end point for admin to send invite from dashboard
inviteRouter.post("/invite", async (req, res) => {
  // need to handle empty response here to prevent creation of token if empty, will add

  const { email } = req.body; // use const if you do not plan on reassigning the value.

  const user = await findUserByEmail(email);
  // prevent invite being sent if user exists
  if (user) {
    res.status(400).json({ message: ["User Already Exists"] });
    return;
  }

  const { token: inviteToken } = await createInviteToken(email);
  // moved the `res` stuff out of registerEmail.
  // better to keep all responses from the server within router functions
  registerEmail(email, inviteToken)
    .then(() => {
      console.log("Email sent");
      res.status(200).json({ message: "Invite sent" });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "Please check e-mail is correct" });
    });
});

module.exports = inviteRouter;
