const auth = {
  login: {
    title: 'Formularz logowania',
    loginPlaceholder: 'Login',
    passwordPlaceholder: 'Hasło',
    noAccount: 'Nie masz konta?',
    submit: 'Zaloguj się',
    success: 'Zalogowano pomyślnie!',
    error: 'Nie udało się zalogować. Spróbuj ponownie.',
    schema: {
      loginRequired: 'Login jest wymagany',
      loginMaxLength: 'Login może mieć maksymalnie 30 znaków',
      passwordRequired: 'Hasło jest wymagane',
      passwordMinLength: 'Hasło musi mieć co najmniej 6 znaków',
      passwordMaxLength: 'Hasło może mieć maksymalnie 50 znaków',
      passwordInvalidChars: 'Hasło może zawierać tylko litery, cyfry oraz _#@-',
    },
  },
  register: {
    title: 'Formularz rejestracji',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Hasło',
    hasAccount: 'Masz już konto?',
    submit: 'Zarejestruj się',
    success: 'Konto dodane pomyślnie!',
    error: 'Nie udało się dodać konta. Spróbuj ponownie.',
    schema: {
      emailRequired: 'Email jest wymagany',
      emailMaxLength: 'Email może mieć maksymalnie 100 znaków',
      emailInvalidFormat: 'Nieprawidłowy format adresu email',
      passwordRequired: 'Hasło jest wymagane',
      passwordMinLength: 'Hasło musi mieć co najmniej 6 znaków',
      passwordMaxLength: 'Hasło może mieć maksymalnie 50 znaków',
      passwordInvalidChars: 'Hasło może zawierać tylko litery, cyfry oraz _#@-',
    },
  },
  sessionExpired: 'Nie udało się odświeżyć sesji. Zaloguj się ponownie.',
};

export default auth;
