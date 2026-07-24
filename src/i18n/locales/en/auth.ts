const auth = {
  login: {
    title: 'Login Form',
    loginPlaceholder: 'Login',
    passwordPlaceholder: 'Password',
    noAccount: "You don't have an account?",
    submit: 'Login',
    success: 'Logged successfully!',
    error: 'Failed to login. Please try again.',
    schema: {
      loginRequired: 'Login is required',
      loginMaxLength: 'Login must be at most 30 characters',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordMaxLength: 'Password must be at most 50 characters',
      passwordInvalidChars: 'Password can only contain letters, numbers, and _#@-',
    },
  },
  register: {
    title: 'Register Form',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    hasAccount: 'Do you have an account?',
    submit: 'Register',
    success: 'Account added successfully!',
    error: 'Failed to add account. Please try again.',
    schema: {
      emailRequired: 'Email is required',
      emailMaxLength: 'Email must be at most 100 characters',
      emailInvalidFormat: 'Invalid email format',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordMaxLength: 'Password must be at most 50 characters',
      passwordInvalidChars: 'Password can only contain letters, numbers, and _#@-',
    },
  },
  sessionExpired: 'Failed to refresh token. Please log in again.',
};

export default auth;
