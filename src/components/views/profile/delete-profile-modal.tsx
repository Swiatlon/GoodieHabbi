import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useProfileSchema } from './schema';
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
  const { t } = useTranslation();
  const { deleteAccountPasswordSchema } = useProfileSchema();
  const dispatch = useTypedDispatch();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(deleteAccountPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const { showSnackbar } = useSnackbar();
  const { handleSubmit } = methods;

  const handleDeleteAccount = async (data: { password: string; confirmPassword: string }) => {
    try {
      await deleteAccount({ password: data.password, confirmPassword: data.confirmPassword }).unwrap();
      onClose();
      showSnackbar({ text: t('profile.deleteAccount.successMessage'), variant: 'success' });
      handleLogout();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('profile.deleteAccount.errorMessage'), variant: SnackbarVariantEnum.ERROR });
    }
  };
  const handleLogout = () => {
    dispatch(logOutAsync());
    router.navigate('/(not-authorized)/login');
    showSnackbar({ text: t('common.loggedOutSuccess'), variant: SnackbarVariantEnum.SUCCESS });
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('profile.deleteAccount.deleting')}
      footer={
        <Button
          label={t('profile.deleteAccount.deleteButton')}
          onPress={handleSubmit(handleDeleteAccount)}
          styleType="danger"
          startIcon={<Ionicons name="trash" size={20} color="white" />}
          className="mx-auto"
        />
      }
    >
      <View className="bg-white p-6 rounded-lg gap-4">
        <Text className="text-lg font-bold mb-4 text-center">{t('profile.deleteAccount.title')}</Text>
        <Text className="text-sm mb-4 text-gray-600 text-center">{t('profile.deleteAccount.confirmMessage')}</Text>
        <FormProvider {...methods}>
          <View className="flex gap-4">
            <ControlledPasswordInput
              name="password"
              label={t('profile.deleteAccount.passwordLabel')}
              placeholder={t('profile.deleteAccount.passwordPlaceholder')}
              secureTextEntry
              isRequired
            />
            <ControlledPasswordInput
              name="confirmPassword"
              label={t('profile.deleteAccount.confirmPasswordLabel')}
              placeholder={t('profile.deleteAccount.confirmPasswordPlaceholder')}
              secureTextEntry
              isRequired
            />
          </View>
        </FormProvider>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
