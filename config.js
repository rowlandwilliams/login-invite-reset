const config = {
  development: {
    clientUrl: "http://localhost:3001",
  },
  production: {
    clientUrl: process.env.APP_URL,
  },
};

module.exports = config;
