import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProfileSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledPasswordInput from '@/components/shared/password/controlled-password-input';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpdateAccountDataMutation, useUpdatePasswordMutation } from '@/redux/api/account/account-api';
import { useLazyGetRandomNicknameQuery } from '@/redux/api/nickname/nickname-api';
import { IApiError, NullableString } from '@/types/global-types';

interface FormDataProfile {
  login: NullableString;
  nickname: NullableString;
  email: string;
  bio: NullableString;
}

interface FormDataPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UpdateProfileModalProps extends IBaseModalProps, FormDataProfile {}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isVisible, onClose, login, nickname, email, bio }) => {
  const { t } = useTranslation();
  const { profileSchema, profilePasswordSchema } = useProfileSchema();
  const { showSnackbar } = useSnackbar();
  const [updateProfile, { isLoading }] = useUpdateAccountDataMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const [fetchNickname] = useLazyGetRandomNicknameQuery();

  const profileMethods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      login: login,
      nickname: nickname,
      email: email,
      bio: bio,
    },
  });

  const passwordMethods = useForm({
    resolver: yupResolver(profilePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { reset: profileReset } = profileMethods;
  const { reset: passwordReset } = passwordMethods;

  const handleSaveProfile = async (data: FormDataProfile) => {
    try {
      await updateProfile(data).unwrap();
      onClose();
      profileReset();
      showSnackbar({ text: t('profile.updateProfile.profileUpdatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('profile.updateProfile.profileUpdatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleChangePassword = async (data: FormDataPassword) => {
    try {
      await updatePassword(data).unwrap();
      onClose();
      passwordReset();
      showSnackbar({ text: t('profile.updateProfile.passwordUpdatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('profile.updateProfile.passwordUpdatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleRefreshNickname = async () => {
    try {
      const result = await fetchNickname().unwrap();
      profileMethods.setValue('nickname', result.nickname);
    } catch {
      showSnackbar({
        text: t('profile.updateProfile.nicknameFetchError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} isLoading={isLoading} loadingMessage={t('profile.updateProfile.updating')}>
      <View className="bg-white p-6 rounded-lg">
        <Text className="text-lg font-bold mb-2 text-center">{t('profile.updateProfile.title')}</Text>
        <FormProvider {...profileMethods}>
          <View className="flex gap-4">
            <ControlledInput name="login" label={t('profile.updateProfile.loginLabel')} placeholder={t('profile.updateProfile.loginPlaceholder')} />

            <View>
              <View className="flex-row items-center gap-1 mb-1">
                <Text className="text-sm font-semibold text-gray-500">{t('profile.updateProfile.nicknameLabel')}</Text>
                <Ionicons name="refresh" size={16} color="#007AFF" onPress={handleRefreshNickname} />
              </View>
              <ControlledInput name="nickname" placeholder={t('profile.updateProfile.nicknamePlaceholder')} />
            </View>
            <ControlledInput
              name="email"
              label={t('profile.updateProfile.emailLabel')}
              placeholder={t('profile.updateProfile.emailPlaceholder')}
              isRequired
              keyboardType="email-address"
            />
            <ControlledInput
              name="bio"
              label={t('profile.updateProfile.bioLabel')}
              placeholder={t('profile.updateProfile.bioPlaceholder')}
              multiline
            />

            <Button
              label={t('profile.updateProfile.saveProfileButton')}
              onPress={profileMethods.handleSubmit(handleSaveProfile)}
              className="mx-auto my-2"
              startIcon={<Ionicons name="save" size={20} color="#fff" />}
            />
          </View>
        </FormProvider>

        <View className="h-0.5 bg-gray-300 my-6" />

        <Text className="text-lg font-bold mb-2">{t('profile.updateProfile.changePasswordTitle')}</Text>
        <FormProvider {...passwordMethods}>
          <View className="flex gap-4">
            <ControlledPasswordInput
              name="oldPassword"
              label={t('profile.updateProfile.oldPasswordLabel')}
              placeholder={t('profile.updateProfile.oldPasswordPlaceholder')}
              secureTextEntry
              isRequired
            />
            <ControlledPasswordInput
              name="newPassword"
              label={t('profile.updateProfile.newPasswordLabel')}
              placeholder={t('profile.updateProfile.newPasswordPlaceholder')}
              secureTextEntry
              isRequired
            />
            <ControlledPasswordInput
              name="confirmNewPassword"
              label={t('profile.updateProfile.confirmPasswordLabel')}
              placeholder={t('profile.updateProfile.confirmPasswordPlaceholder')}
              secureTextEntry
              isRequired
            />
            <Button
              label={t('profile.updateProfile.changePasswordButton')}
              onPress={passwordMethods.handleSubmit(handleChangePassword)}
              className="mx-auto my-2"
              startIcon={<Ionicons name="lock-closed" size={20} color="#fff" />}
            />
          </View>
        </FormProvider>
      </View>
    </Modal>
  );
};

export default UpdateProfileModal;
