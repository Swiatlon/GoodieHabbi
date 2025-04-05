import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { deleteAccountPasswordSchema } from './schema';
import Button from '@/components/shared/button/button';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledPasswordInput from '@/components/shared/password/controlled-password-input';
import { useTypedDispatch } from '@/hooks/use-store-hooks';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteAccountMutation } from '@/redux/api/account/account-api';
import { logOutAsync } from '@/redux/state/auth/auth-state';
import { IApiError } from '@/types/global-types';

interface DeleteAccountModalProps extends IBaseModalProps {}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isVisible, onClose }) => {
  const dispatch = useTypedDispatch();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(deleteAccountPasswordSchema),
    defaultValues: {
      password: '',
    },
  });
  const [deleteAccount] = useDeleteAccountMutation();

  const { showSnackbar } = useSnackbar();
  const { handleSubmit } = methods;

  const handleDeleteAccount = async (data: { password: string }) => {
    try {
      await deleteAccount({ password: data.password }).unwrap();
      onClose();
      showSnackbar({ text: 'Account deleted successfully!', variant: 'success' });
      handleLogout();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || 'Failed to delete account. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };
  const handleLogout = () => {
    dispatch(logOutAsync());
    router.navigate('/(not-authorized)/login');
    showSnackbar({ text: 'Logged off sucessfully!', variant: SnackbarVariantEnum.SUCCESS });
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      footer={
        <Button
          label="Delete Account"
          onPress={handleSubmit(handleDeleteAccount)}
          styleType="danger"
          startIcon={<Ionicons name="trash" size={20} color="white" />}
          className="mx-auto"
        />
      }
    >
      <View className="bg-white p-6 rounded-lg gap-4">
        <Text className="text-lg font-bold mb-4 text-center">Delete Account</Text>
        <Text className="text-sm mb-4 text-gray-600 text-center">Are you sure you want to delete your account? This action is irreversible.</Text>

        <FormProvider {...methods}>
          <View className="flex gap-4">
            <ControlledPasswordInput name="password" label="Enter Password" placeholder="Enter your password" secureTextEntry isRequired />
          </View>
        </FormProvider>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
