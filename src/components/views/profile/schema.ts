import * as yup from 'yup';

const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

export const profileSchema = yup.object().shape({
  login: yup.string().optional().max(30, 'Login must be at most 30 characters'),
  nickname: yup.string().optional(),
  email: yup.string().email('Invalid email').required('Email is required'),
  bio: yup.string().optional(),
});

export const profilePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(passwordRegex, 'Password can only contain letters, numbers, and _#@-'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required'),
});
