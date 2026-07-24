import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

export const useLoginValidationSchema = () => {
  const { t } = useTranslation();

  return Yup.object().shape({
    login: Yup.string().required(t('auth.login.schema.loginRequired')).max(30, t('auth.login.schema.loginMaxLength')),

    password: Yup.string()
      .required(t('auth.login.schema.passwordRequired'))
      .min(6, t('auth.login.schema.passwordMinLength'))
      .max(50, t('auth.login.schema.passwordMaxLength'))
      .matches(passwordRegex, t('auth.login.schema.passwordInvalidChars')),
  });
};
