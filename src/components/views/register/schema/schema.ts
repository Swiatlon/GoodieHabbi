import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email format')
    .max(100, 'Email must not exceed 50 characters'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9#@-]*$/, 'Password can only contain letters, numbers, #, @, and -'),
  // TODO: LATER DEPEND HOW WE CARE ABOUT SECURITY
  // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  // .matches(/\d/, 'Password must contain at least one number')
  // .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &)'),
});
