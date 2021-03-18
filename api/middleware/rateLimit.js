const rateLimit = require("express-rate-limit");

// Rate limit middleware
// 10 requests per hour
const loginInviteLimitMiddleware = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "You have exceeded your 20 requests per hour limit.",
  headers: true,
});

const userLimitMiddleware = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: "You have exceeded your 500 requests per hour limit.",
  headers: true,
});

const dataLimitMiddleware = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3000,
  message: "You have exceeded your 3000 requests per hour limit.",
  headers: true,
});

// Export it
module.exports = {
  loginInviteLimitMiddleware,
  dataLimitMiddleware,
  userLimitMiddleware,
};
