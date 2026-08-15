import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import Select from '@/components/shared/select/select';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetSupplementsQuery } from '@/redux/api/supplements/catalog-api';
import { useLogAdHocIntakeMutation } from '@/redux/api/supplements/intakes-api';
import { IApiError } from '@/types/global-types';

interface AdHocModalProps extends IBaseModalProps {
  date: string;
}

interface AdHocFormValues {
  amount: string;
}

const parseAmount = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
};

const AdHocModal: React.FC<AdHocModalProps> = ({ isVisible, onClose, date }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: supplements = [] } = useGetSupplementsQuery();
  const [logAdHocIntake, { isLoading }] = useLogAdHocIntakeMutation();
  const [supplementId, setSupplementId] = useState<number | null>(null);

  const methods = useForm<AdHocFormValues>({ defaultValues: { amount: '' } });
  const { handleSubmit, reset: resetForm } = methods;

  const activeSupplements = supplements.filter(supplement => supplement.isActive);
  const selectedSupplement = supplements.find(s => s.id === supplementId);

  const onSubmit = async (values: AdHocFormValues) => {
    if (supplementId == null) return;

    try {
      await logAdHocIntake({ supplementId, date, amount: parseAmount(values.amount) }).unwrap();
      showSnackbar({ text: t('supplements.checklist.adHocLoggedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      setSupplementId(null);
      resetForm({ amount: '' });
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('supplements.checklist.adHocLoggedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      testID="ad-hoc-modal"
      footer={
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={supplementId == null}
          className={`flex-row items-center justify-center gap-1 rounded-lg px-4 py-2 ${supplementId != null ? 'bg-primary' : 'bg-gray-200'}`}
          testID="btn-log-ad-hoc"
        >
          <Ionicons name="add-circle-outline" size={18} color={supplementId != null ? 'white' : '#9ca3af'} />
          <Text className={`font-semibold ${supplementId != null ? 'text-white' : 'text-gray-400'}`}>{t('supplements.checklist.logAdHoc')}</Text>
        </TouchableOpacity>
      }
    >
      <Text className="text-lg font-bold text-gray-800 text-center mb-4">{t('supplements.checklist.adHocTitle')}</Text>

      <View className="gap-5">
        <Select
          placeholder={t('supplements.checklist.pickSupplementPlaceholder')}
          value={supplementId}
          onChange={value => setSupplementId(value != null ? Number(value) : null)}
          isModalVersion={true}
          options={activeSupplements.map(supplement => ({ label: supplement.name, value: supplement.id }))}
          testID="ad-hoc-supplement-select"
        />

        <FormProvider {...methods}>
          <ControlledInput
            name="amount"
            label={`${t('supplements.checklist.amountLabel')}${selectedSupplement ? ` (${t(`supplements.enums.unit.${selectedSupplement.unit}`)})` : ''}`}
            placeholder={selectedSupplement?.defaultAmount != null ? String(selectedSupplement.defaultAmount) : '0'}
            keyboardType="decimal-pad"
            testID="ad-hoc-amount-input"
          />
        </FormProvider>
      </View>
    </Modal>
  );
};

export default AdHocModal;
