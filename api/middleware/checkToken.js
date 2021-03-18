// middlewares for invite func

const { findInviteByInviteToken } = require('../db/invites');

const checkInviteTokenMiddleware = async (req, res, next) => {
  req.logout();
  const inviteToken = req.params.token;

  try {
    const invite = await findInviteByInviteToken(inviteToken);
    // check token exists, is unused, and hasn't expired
    if (!invite || invite.used || new Date().getTime() > invite.invite_token_expires.getTime()) {
      res.status(401).end();
      return;
    }

    res.locals.tokenInfo = invite;
    next();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkInviteTokenMiddleware,
};
