require('dotenv').config();
const pgtools = require('pgtools');

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const { DB_DATABASE } = process.env;

// requires that process.env.DB_DATABASE be present or fails
if (!DB_DATABASE) {
  throw new Error('Missing env var "DB_DATABASE"');
}

function dropDBIfExists() {
  console.info('start dropDBIfExists');
  return pgtools
    .dropdb(config, DB_DATABASE)
    .catch((e) => {
      // if db with name of process.env.DB_DATABASE does not exist
      // that is okay, but by default an error is thrown.
      // need to check that the caught error is the expected and
      // acceptable "db does not exist" error.
      // if it is an error other than the expected one, throw it to
      // handle somewhere else
      if (
        !e.pgErr ||
        !e.pgErr.message ||
        e.pgErr.message !== `database "${DB_DATABASE}" does not exist`
      ) {
        throw e;
      }
    })
    .finally(() => console.info('dropDBIfExists complete'));
}

function createdb() {
  console.info('start createdb');
  return pgtools.createdb(config, DB_DATABASE).finally(() => console.info('createdb complete'));
}

async function reset() {
  await dropDBIfExists();
  await createdb();
  // deliberately requiring this later because this file depends on the db
  // already existing at the time it is loaded and since it won't necessarily exist until we create it
  // in the previous step, we cannot require the file until we can ensure
  // that it has been created
  const migrate = require('./migrate');
  // this creates the tables as defined in `./migrations/db-migration.sql`
  await migrate();
  // this "seeds"" the database as defined with data (one admin user)
  const seed = require('./seed');
  await seed();
  const { pool } = require('./dbConfig');
  return pool.end();
}

reset()
  .then(() => console.info('Success'))
  .catch((e) => console.error(e));
