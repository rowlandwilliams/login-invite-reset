// serialize user in session
function serializeUser(user, withAdmin = false) {
  if (!user) {
    return {};
  }
  const { id, first_name, last_name, email, admin } = user;
  const serializedUser = { id, first_name, last_name, email };
  if (withAdmin) {
    serializedUser.admin = admin;
  }
  return serializedUser;
}

module.exports = serializeUser;
