const { findUserByResetToken } = require("../db/users");

// middlewares for password reset func
// check token provided in email link
const checkPasswordTokenMiddleware = async (req, res, next) => {
  req.logout();
  const { token: resetToken } = req.params;

  try {
    const user = await findUserByResetToken(resetToken);
    // if token doesn't exist or is expired
    if (!user || new Date().getTime() > user.reset_token_expires.getTime()) {
      res.status(401).end();
      return;
    }
    res.locals.passwordEmail = user.email;
    next();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkPasswordTokenMiddleware,
};
