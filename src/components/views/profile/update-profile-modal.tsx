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
import { IApiError, NullableString } from '@/types/global-types';

interface FormDataProfile {
  nickname: NullableString;
  email: string;
  bio: NullableString;
  login: NullableString;
}

interface FormDataPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UpdateProfileModalProps extends IBaseModalProps {
  user: FormDataProfile;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isVisible, onClose, user }) => {
  const { showSnackbar } = useSnackbar();
  const [updateProfile] = useUpdateAccountDataMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const profileMethods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      login: user.login,
      nickname: user.nickname,
      email: user.email,
      bio: user.bio,
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

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="bg-white p-6 rounded-lg">
        <Text className="text-lg font-bold mb-4 text-centerabc">Update Profile</Text>

        <FormProvider {...profileMethods}>
          <View className="flex gap-4">
            <ControlledInput name="login" label="Login:" placeholder="Enter login" />
            <ControlledInput name="nickname" label="Nickname:" placeholder="Enter nickname" />
            <ControlledInput name="email" label="Email:" placeholder="Enter email" isRequired keyboardType="email-address" />
            <ControlledInput name="bio" label="Bio:" placeholder="Enter bio" multiline />

            <Button
              label="Save Profile"
              onPress={profileMethods.handleSubmit(handleSaveProfile)}
              className="mx-auto"
              startIcon={<Ionicons name="save" size={20} color="#fff" />}
            />
          </View>
        </FormProvider>

        <View className="h-0.5 bg-gray-300 my-6" />

        <Text className="text-lg font-bold mb-4">Change Password</Text>

        <FormProvider {...passwordMethods}>
          <View className="flex gap-4">
            <ControlledPasswordInput name="oldPassword" label="Old Password:" placeholder="Enter new password" secureTextEntry isRequired />
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
              className="mx-auto"
              startIcon={<Ionicons name="lock-closed" size={20} color="#fff" />}
            />
          </View>
        </FormProvider>
      </View>
    </Modal>
  );
};

export default UpdateProfileModal;
