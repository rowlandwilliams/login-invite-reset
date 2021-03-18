// used to authenticate a user
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const { findUserByEmail, findUserById } = require("../db/users");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { passReqToCallback: true },
      async (request, email, password, done) => {
        const user = await findUserByEmail(email);
        if (!user) {
          return done(null, false);
        }
        // manually set expiration of cookie date/time of session
        // https://github.com/jaredhanson/passport-facebook/issues/46#issuecomment-22716951

        // manually set expiration of cookie date/time of session
        const expiration = 360 * 10000 * 24; // 24 hours login time
        request.session.cookie.expires = new Date(Date.now() + expiration);

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );

  passport.serializeUser((user, cb) => {
    console.log("passport serializing..." + user.email);

    cb(null, user.id);
  });

  // find user in database with id matching cookies id
  passport.deserializeUser(async (id, cb) => {
    const user = await findUserById(id);
    // this code removes the password field and then takes the rest of the user fields
    // and saves them in an object called restUser.
    const { password, ...restUser } = user;

    cb(null, restUser);
  });
};
