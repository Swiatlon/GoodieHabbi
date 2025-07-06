import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { profilePasswordSchema, profileSchema } from './schema';
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
      showSnackbar({ text: 'Profile updated!', variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || 'Failed to update profile. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleChangePassword = async (data: FormDataPassword) => {
    try {
      await updatePassword(data).unwrap();
      onClose();
      passwordReset();
      showSnackbar({ text: 'Password updated!', variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || 'Failed to update password. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleRefreshNickname = async () => {
    try {
      const result = await fetchNickname().unwrap();
      profileMethods.setValue('nickname', result.nickname);
    } catch {
      showSnackbar({
        text: 'Failed to fetch nickname',
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} isLoading={isLoading} loadingMessage="Updating profile...">
      <View className="bg-white p-6 rounded-lg">
        <Text className="text-lg font-bold mb-2 text-center">Update Profile</Text>
        <FormProvider {...profileMethods}>
          <View className="flex gap-4">
            <ControlledInput name="login" label="Login:" placeholder="Enter login" />

            <View>
              <View className="flex-row items-center gap-1 mb-1">
                <Text className="text-sm font-semibold text-gray-500">Nickname:</Text>
                <Ionicons name="refresh" size={16} color="#007AFF" onPress={handleRefreshNickname} />
              </View>
              <ControlledInput name="nickname" placeholder="Enter nickname" />
            </View>
            <ControlledInput name="email" label="Email:" placeholder="Enter email" isRequired keyboardType="email-address" />
            <ControlledInput name="bio" label="Bio:" placeholder="Enter bio" multiline />

            <Button
              label="Save Profile"
              onPress={profileMethods.handleSubmit(handleSaveProfile)}
              className="mx-auto my-2"
              startIcon={<Ionicons name="save" size={20} color="#fff" />}
            />
          </View>
        </FormProvider>

        <View className="h-0.5 bg-gray-300 my-6" />

        <Text className="text-lg font-bold mb-2">Change Password</Text>
        <FormProvider {...passwordMethods}>
          <View className="flex gap-4">
            <ControlledPasswordInput name="oldPassword" label="Old Password:" placeholder="Enter old password" secureTextEntry isRequired />
            <ControlledPasswordInput name="newPassword" label="New Password:" placeholder="Enter new password" secureTextEntry isRequired />
            <ControlledPasswordInput
              name="confirmNewPassword"
              label="Confirm Password:"
              placeholder="Confirm new password"
              secureTextEntry
              isRequired
            />
            <Button
              label="Change Password"
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
