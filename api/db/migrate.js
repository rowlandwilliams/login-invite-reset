const fs = require("fs");
const path = require("path");
const { pool, query } = require("./dbConfig");
const seed = require("./seed");

// migrate users table to db

async function migrate() {
  console.info("start migrate");
  // reads the db-migration.sql file as a string

  // create tables
  const createTables = fs
    .readFileSync(path.join(__dirname, "/migrations", "createTables.sql"))
    .toString();
  await query(createTables);

  // create proto user
  await seed();
}

// if this file is being run directly, then call the function.
// however, if it is being required, then do not call it
if (require.main === module) {
  migrate().then(async () => {
    // close connection to db
    await pool.end();
  });
}

module.exports = migrate;
