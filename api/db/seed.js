const { createUser } = require("./users");
const { pool } = require("./dbConfig");

async function seed() {
  console.info("start seed");
  const protoUser = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@email.com",
    password: "password",
    admin: true,
  };
  const user = await createUser(protoUser);
  console.info(
    "------------------------------------------------------------------------------"
  );
  console.info(
    "created admin user",
    user.email,
    "with password:",
    protoUser.password
  );
  console.info(
    "------------------------------------------------------------------------------"
  );
  console.info("seed process complete");
}

if (require.main === module) {
  seed().then(async () => {
    await pool.end();
  });
}

module.exports = seed;
