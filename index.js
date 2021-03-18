const express = require("express");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const redis = require("redis");
const logger = require("morgan");
const sslRedirect = require("heroku-ssl-redirect").default;
const RedisStore = require("connect-redis")(session);
require("dotenv").config();
const passportConfig = require("./api/middleware/passportConfig");
require("./api/db/dbConfig");

const app = express();

const PORT = process.env.PORT || 3000;

const redisClientUrl = process.env.REDIS_URL || undefined;
const redisClient = redis.createClient(redisClientUrl);
redisClient.on("error", (err) => {
  // use console.error here to see full stack trace. May be helpful for debugging down the road
  console.error("Redis error: ", err);
});

app.use(logger("dev"));

// middle ware
app.use(sslRedirect());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set all helmet headers excluding csp
app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // allow mapbox api key to work
  })
);

// define csp
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-hashes' 'sha256-deDIoPlRijnpfbTDYsK+8JmDfUBmpwpnb0L/SUV8NeU='; font-src 'self' https://fonts.gstatic.com; worker-src 'self' blob: ; child-src 'self' blob: ; img-src 'self' data: blob: ; connect-src 'self' ; object-src 'none' ;`
  );
  next();
});

app.use(
  session({
    secret: process.env.SECRET,
    name: "_redisStore",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 360 * 10000 * 24, // 24 hours login time
      secure: "auto",
      sameSite: "lax",
    },
    store: new RedisStore({
      client: redisClient,
    }),
  })
);

app.use(cookieParser(process.env.SECRET));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use("/api", require("./api/api.router"));

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server Has Started");
});
