const express = require("express");
const { isLoggedIn } = require("./middleware/auth");
const authRouter = require("./routers/auth.router");
const resetPasswordRouter = require("./routers/resetPassword.router");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/invite", require("./routers/invite.router"));
apiRouter.use("/reset-password", resetPasswordRouter);

// all endpoints within these routes are must be authenticated
apiRouter.use("/user", isLoggedIn, require("./routers/user.router"));

apiRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ errors: [{ message: err.message }] });
});
module.exports = apiRouter;
