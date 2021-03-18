const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const serializeUser = require("../serializers/user");
const { loginInviteLimitMiddleware } = require("../middleware/rateLimit");

// limit to 20 req per hour
authRouter.use(loginInviteLimitMiddleware);

// login
authRouter.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Please enter all fields." });
    return;
  }

  passport.authenticate("local", (err, user) => {
    if (err) throw err;
    if (!user)
      // if no user exists or password is incorrest
      res.status(400).json({ message: "E-mail or password incorrect." });
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        const serializedUser = serializeUser(req.user, true);
        res.send(serializedUser);
      });
    }
  })(req, res, next);
});

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.status(200).end();
});

module.exports = authRouter;
