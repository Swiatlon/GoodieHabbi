import * as yup from 'yup';

const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password must be at most 50 characters')
  .matches(passwordRegex, 'Password can only contain letters, numbers, and _#@-');

export const profileSchema = yup.object().shape({
  login: yup
    .string()
    .optional()
    .min(3, 'Login must be at least 6 characters')
    .max(16, 'Login must be at least 6 characters')
    .nullable()
    .default(null),
  nickname: yup.string().nullable().default(null).min(3, 'Nickname must be at least 6 characters').max(16, 'Nickname must be at most 6 characters'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .min(7, 'Email must be at least 7 characters')
    .max(100, 'Email must be at most 100 characters'),
  bio: yup.string().max(30, 'Bio must be at most 30 characters').nullable().default(null),
});

export const profilePasswordSchema = yup.object().shape({
  oldPassword: passwordValidation,
  newPassword: passwordValidation,
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm Password is required'),
});

export const deleteAccountPasswordSchema = yup.object().shape({
  password: passwordValidation,
});
