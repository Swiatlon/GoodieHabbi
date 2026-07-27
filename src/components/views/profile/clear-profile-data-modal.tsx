import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProfileSchema } from './schema';
import Button from '@/components/shared/button/button';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledPasswordInput from '@/components/shared/password/controlled-password-input';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useWipeoutAccountDataMutation } from '@/redux/api/account/account-api';
import { IApiError } from '@/types/global-types';

interface ClearProfileDataModalProps extends IBaseModalProps {}

const ClearProfileDataModal: React.FC<ClearProfileDataModalProps> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { deleteAccountPasswordSchema } = useProfileSchema();
  const methods = useForm({
    resolver: yupResolver(deleteAccountPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const [wipeoutData, { isLoading }] = useWipeoutAccountDataMutation();
  const { showSnackbar } = useSnackbar();
  const { handleSubmit } = methods;

  const handleClearData = async (data: { password: string; confirmPassword: string }) => {
    try {
      await wipeoutData(data).unwrap();
      onClose();
      showSnackbar({ text: t('profile.wipeoutData.successMessage'), variant: SnackbarVariantEnum.SUCCESS });
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({
        text: error.data?.message || t('profile.wipeoutData.errorMessage'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('profile.wipeoutData.clearing')}
      footer={
        <Button
          label={t('profile.wipeoutData.clearButton')}
          onPress={handleSubmit(handleClearData)}
          styleType="danger"
          startIcon={<Ionicons name="trash-bin" size={20} color="white" />}
          className="mx-auto"
        />
      }
    >
      <View className="bg-white p-6 rounded-lg gap-4">
        <Text className="text-lg font-bold mb-4 text-center">{t('profile.wipeoutData.title')}</Text>
        <Text className="text-sm mb-4 text-gray-600 text-center">{t('profile.wipeoutData.confirmMessage')}</Text>
        <FormProvider {...methods}>
          <View className="flex gap-4">
            <ControlledPasswordInput
              name="password"
              label={t('profile.wipeoutData.passwordLabel')}
              placeholder={t('profile.wipeoutData.passwordPlaceholder')}
              secureTextEntry
              isRequired
            />
            <ControlledPasswordInput
              name="confirmPassword"
              label={t('profile.wipeoutData.confirmPasswordLabel')}
              placeholder={t('profile.wipeoutData.confirmPasswordPlaceholder')}
              secureTextEntry
              isRequired
            />
          </View>
        </FormProvider>
      </View>
    </Modal>
  );
};

export default ClearProfileDataModal;
