const express = require("express");
const { findAllUsers } = require("../db/users");
const { isAdmin } = require("../middleware/auth");
const serializeUser = require("../serializers/user");
require("dotenv").config();

const userRouter = express.Router();
const { userLimitMiddleware } = require("../middleware/rateLimit");

// on app load get current user from server
userRouter.get("/current", userLimitMiddleware, (req, res) => {
  if (req.user) {
    const serializedUser = serializeUser(req.user, true);
    res.send(serializedUser);
  } else {
    res.send(undefined); // if no user req.user will be undefined
  }
});

// all endpoints defined after this point will have the `isAdmin` middleware applied to it
userRouter.use(isAdmin);

// get users for admin board
userRouter.get("/users", userLimitMiddleware, async (req, res) => {
  const users = await findAllUsers();
  // the serializeUser function will remove the password and token fields
  // returns a user's id, name fields, email
  const serializedUsers = users.map((user) => serializeUser(user));
  res.status(200).json(serializedUsers);
});

module.exports = userRouter;
