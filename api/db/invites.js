const { query } = require('./dbConfig');
const generateInviteToken = require('../utils/tokens');

// marks an invite as used in the db
function markInviteUsed(inviteToken) {
  return query(`UPDATE invitations SET used=true WHERE invite_token=$1`, [inviteToken]);
}

// creates an entry in db for an invite token for that email
async function createInviteToken(email) {
  const { token, expires } = await generateInviteToken();
  await query(
    `INSERT INTO invitations(invite_token, invite_token_expires, email) 
      VALUES ($1, to_timestamp($2), $3)`,
    [token, expires, email],
  );
  return { token, expires };
}

// finds an invite by invite token
// returns an object representing an invite or undefined
async function findInviteByInviteToken(inviteToken) {
  const { rows } = await query(`SELECT * FROM invitations WHERE invite_token=$1`, [inviteToken]);
  return rows[0];
}

module.exports = { markInviteUsed, createInviteToken, findInviteByInviteToken };
