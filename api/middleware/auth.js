// check if logged in using req.isAuthenticated (passport function)
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401); // 401 = not authenticated
    res.json({ errors: ["Unauthorized"] });
  }
};

// check is logged in and is Admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(403); // 403 you are authenticated but forbidden
    res.json({ errors: ["Forbidden"] });
  }
};

module.exports = {
  isLoggedIn,
  isAdmin,
};
