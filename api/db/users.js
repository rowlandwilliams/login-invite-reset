const bcrypt = require('bcrypt');
const { query, pool } = require('./dbConfig');
const generatePasswordResetToken = require('../utils/tokens');

// creates a user (with hashed password), given a firstName, lastName, email, password, and admin\
// returns the newly created user
async function createUser({ firstName, lastName, email, password, admin = false }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await query(
    `INSERT INTO users (first_name, last_name, email, password, admin) VALUES ($1, $2, $3, $4, $5)`,
    [firstName, lastName, email, hashedPassword, admin],
  );
  return findUserByEmail(email);
}

// returns object representing the user or undefined
async function findUserByEmail(email) {
  const { rows } = await query(`SELECT * FROM users WHERE email=$1`, [email]);
  // if rows.length === 0, then returns undefined
  return rows[0];
}

// returns object representing the user or undefined
async function findUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  // if rows.length === 0, then returns undefined
  return rows[0];
}

// returns object representing the user or undefined
async function findUserByResetToken(resetToken) {
  const { rows } = await query(`SELECT * FROM users WHERE reset_token=$1`, [resetToken]);
  // if rows.length === 0, then returns undefined
  return rows[0];
}

async function findAllUsers() {
  const { rows } = await query(`SELECT * FROM users ORDER BY id`, null);
  return rows;
}

// creates a pw reset token
async function createPasswordResetToken(id) {
  const { token, expires } = await generatePasswordResetToken();
  await query(`UPDATE users SET reset_token_expires=to_timestamp($1), reset_token=$2 WHERE id=$3`, [
    expires,
    token,
    id,
  ]);
  return { token, expires };
}

async function setPasswordUponSuccessfulReset(id, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await query(
    `UPDATE users SET password=$1, reset_token=NULL, reset_token_expires=NULL WHERE id=$2`,
    [hashedPassword, id],
  );
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  findAllUsers,
  createPasswordResetToken,
  setPasswordUponSuccessfulReset,
};
