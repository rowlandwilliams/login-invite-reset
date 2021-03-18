require("dotenv").config();

const { Pool } = require("pg"); // node pg library

// check if app is in produciton mode
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = isProduction // if production ensure ssl
  ? new Pool({
      connectionString: process.env.DATABASE_URL || connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      // if its production use the database url on heroku, if not use the conneciton string
      connectionString: process.env.DATABASE_URL || connectionString,
    });

// custom db query function
function query(queryString, params) {
  return new Promise((resolve, reject) => {
    // resolve succcess, reject error
    pool.query(queryString, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = { pool, query };
