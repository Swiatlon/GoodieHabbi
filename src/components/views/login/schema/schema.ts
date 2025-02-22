import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  login: Yup.string().required('Login is required').min(3, 'Title must be at least 3 characters'),
  password: Yup.string().required('Password is required').min(3, 'Title must be at least 3 characters'),
});
