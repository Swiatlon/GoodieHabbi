import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').max(100, 'Email must be at most 100 characters').matches(emailRegex, 'Invalid email format'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(passwordRegex, 'Password can only contain letters, numbers, and _#@-'),
});
