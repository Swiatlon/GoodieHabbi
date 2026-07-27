import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const passwordRegex = /^[a-zA-Z0-9_#@!-]*$/;

export const useProfileSchema = () => {
  const { t } = useTranslation();

  const passwordValidation = yup
    .string()
    .required(t('profile.schema.passwordRequired'))
    .min(6, t('profile.schema.passwordMin'))
    .max(50, t('profile.schema.passwordMax'))
    .matches(passwordRegex, t('profile.schema.passwordPattern'));

  const profileSchema = yup.object().shape({
    login: yup.string().optional().min(3, t('profile.schema.loginMin')).max(16, t('profile.schema.loginMax')).nullable().default(null),
    nickname: yup.string().nullable().default(null).min(3, t('profile.schema.nicknameMin')).max(25, t('profile.schema.nicknameMax')),
    email: yup
      .string()
      .email(t('profile.schema.emailInvalid'))
      .required(t('profile.schema.emailRequired'))
      .min(7, t('profile.schema.emailMin'))
      .max(100, t('profile.schema.emailMax')),
    bio: yup.string().max(30, t('profile.schema.bioMax')).nullable().default(null),
  });

  const profilePasswordSchema = yup.object().shape({
    oldPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], t('profile.schema.passwordsDoNotMatch'))
      .required(t('profile.schema.confirmPasswordRequired')),
  });

  const deleteAccountPasswordSchema = yup.object().shape({
    password: passwordValidation,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('profile.schema.passwordsDoNotMatch'))
      .required(t('profile.schema.confirmPasswordRequired')),
  });

  return { profileSchema, profilePasswordSchema, deleteAccountPasswordSchema };
};
