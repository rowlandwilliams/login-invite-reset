// for password reset form
const validateCredentials = (username, password, password2) => {
  const errors = [];
  const emailTest = /\S+@\S+/.test(String(username).toLowerCase());
  const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);

  if (!username || !password || !password2) {
    errors.push('Please enter all fields');
  }
  if (emailTest === false) {
    errors.push('Invalid e-mail');
  }
  if (passwordTest === false) {
    errors.push(
      'Password must be at least 8 characters long and contain 1 number, one uppercase letter and one lowercase letter.',
    );
  }
  if (password !== password2) {
    errors.push('Passwords must match');
  }
  if (password.length < 5) {
    errors.push('Passwords must be longer than 5 characters');
  }
  return errors;
};

// for register form
const validateRegisterCredentials = (firstName, lastName, email, password, password2) => {
  const errors = [];
  const emailTest = /\S+@\S+/.test(String(email).toLowerCase());
  const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
  console.log(passwordTest);

  if (!firstName || !lastName || !password || !password2) {
    errors.push('Please enter all fields');
  }
  if (emailTest === false) {
    errors.push('Invalid e-mail');
  }
  if (passwordTest === false) {
    errors.push(
      'Password must be at least 8 characters long and contain 1 number, one uppercase letter and one lowercase letter.',
    );
  }
  if (password !== password2) {
    errors.push('Passwords must match');
  }
  if (password.length < 5) {
    errors.push('Passwords must be longer than 5 characters');
  }

  return errors;
};

module.exports = {
  validateCredentials,
  validateRegisterCredentials,
};
