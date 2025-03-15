import * as yup from 'yup';

export const tagValidationSchema = yup.object().shape({
  value: yup.string().trim().required('Tag cannot be empty').max(25, 'Tag is too long. Please keep it under 25 characters.'),
  backgroundColor: yup.string().default('#1987EE'),
  textColor: yup.string().default('#FFFFFF'),
});
