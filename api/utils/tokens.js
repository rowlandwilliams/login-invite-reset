const crypto = require("crypto");

// generates a new token (invite or password reset)
// made this use promises so that we can use async/await
function generateToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, async function (err, buffer) {
      if (err) {
        reject(err);
        return;
      }
      const token = buffer.toString("hex");
      // expires after 24 hours
      const expires = (Date.now() + 86400000) / 1000;
      resolve({ token, expires });
    });
  });
}

module.exports = generateToken;
