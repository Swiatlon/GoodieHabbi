import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

export const useRegisterValidationSchema = () => {
  const { t } = useTranslation();

  return Yup.object().shape({
    email: Yup.string()
      .required(t('auth.register.schema.emailRequired'))
      .max(100, t('auth.register.schema.emailMaxLength'))
      .matches(emailRegex, t('auth.register.schema.emailInvalidFormat')),

    password: Yup.string()
      .required(t('auth.register.schema.passwordRequired'))
      .min(6, t('auth.register.schema.passwordMinLength'))
      .max(50, t('auth.register.schema.passwordMaxLength'))
      .matches(passwordRegex, t('auth.register.schema.passwordInvalidChars')),
  });
};
