import * as Yup from 'yup';

const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

export const loginValidationSchema = Yup.object().shape({
  login: Yup.string().required('Login is required').max(100, 'Login must be at most 100 characters'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(passwordRegex, 'Password can only contain letters, numbers, and _#@-'),
});
