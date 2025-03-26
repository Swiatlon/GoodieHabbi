import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { profilePasswordSchema, profileSchema } from './schema';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledPasswordInput from '@/components/shared/password/controlled-password-input';

interface UpdateProfileModalProps extends IBaseModalProps {
  user: { nickname: string; email: string; bio: string; login: string };
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isVisible, onClose, user }) => {
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
      password: '',
      confirmPassword: '',
    },
  });

  const handleSaveProfile = (data: { nickname?: string; email: string; bio?: string; login?: string }) => {
    Alert.alert('Success', 'Profile data updated!');
  };

  const handleChangePassword = (data: { password: string; confirmPassword: string }) => {
    Alert.alert('Success', 'Password updated successfully!');
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View className="bg-white p-6 rounded-lg">
        <Text className="text-lg font-bold mb-4">Update Profile</Text>

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
            <ControlledPasswordInput name="password" label="New Password:" placeholder="Enter new password" secureTextEntry isRequired />
            <ControlledPasswordInput name="confirmPassword" label="Confirm Password:" placeholder="Confirm new password" secureTextEntry isRequired />

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
