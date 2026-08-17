import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSupplementValidationSchema } from './schema';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledSwatches from '@/components/shared/swatches/controlled-swatches';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import ControlledSupplementIconPicker from '@/components/views/supplements/reusable/supplement-icon-picker';
import ControlledSupplementUnitPicker from '@/components/views/supplements/reusable/supplement-unit-picker';
import { ISupplement, SupplementUnitEnum } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateSupplementMutation, useUpdateSupplementMutation } from '@/redux/api/supplements/catalog-api';
import { IApiError } from '@/types/global-types';
import { DEFAULT_SUPPLEMENT_COLOR, DEFAULT_SUPPLEMENT_EMOJI } from '@/utils/supplements/supplement-visuals';

interface SupplementFormModalProps extends IBaseModalProps {
  supplement: ISupplement | null;
}

interface SupplementFormValues {
  name: string;
  unit: SupplementUnitEnum;
  defaultAmount: string;
  note: string | null;
  color: string | null;
  icon: string | null;
}

const DEFAULT_VALUES: SupplementFormValues = {
  name: '',
  unit: SupplementUnitEnum.Capsule,
  defaultAmount: '',
  note: null,
  color: DEFAULT_SUPPLEMENT_COLOR,
  icon: DEFAULT_SUPPLEMENT_EMOJI,
};

const parseAmount = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsed = parseFloat(value.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
};

const SupplementFormModal: React.FC<SupplementFormModalProps> = ({ isVisible, onClose, supplement }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createSupplement, { isLoading: isCreating }] = useCreateSupplementMutation();
  const [updateSupplement, { isLoading: isUpdating }] = useUpdateSupplementMutation();
  const validationSchema = useSupplementValidationSchema();

  const methods = useForm<SupplementFormValues>({ resolver: yupResolver(validationSchema), defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset: resetForm, watch } = methods;
  const selectedColor = watch('color') ?? DEFAULT_SUPPLEMENT_COLOR;

  useEffect(() => {
    if (!isVisible) return;

    resetForm(
      supplement
        ? {
            name: supplement.name,
            unit: supplement.unit,
            defaultAmount: supplement.defaultAmount != null ? String(supplement.defaultAmount) : '',
            note: supplement.note,
            color: supplement.color ?? DEFAULT_SUPPLEMENT_COLOR,
            icon: supplement.icon?.trim() || DEFAULT_SUPPLEMENT_EMOJI,
          }
        : DEFAULT_VALUES
    );
  }, [isVisible, supplement, resetForm]);

  const onSubmit = async (values: SupplementFormValues) => {
    const payload = {
      name: values.name.trim(),
      unit: values.unit,
      defaultAmount: parseAmount(values.defaultAmount),
      note: values.note?.trim() || null,
      color: values.color?.trim() || null,
      icon: values.icon?.trim() || null,
    };

    try {
      if (supplement) {
        await updateSupplement({ id: supplement.id, data: payload }).unwrap();
        showSnackbar({ text: t('supplements.catalog.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      } else {
        await createSupplement(payload).unwrap();
        showSnackbar({ text: t('supplements.catalog.createdSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      }
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({
        text: error.data?.message || t(supplement ? 'supplements.catalog.updatedError' : 'supplements.catalog.createdError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating}
      loadingMessage={supplement ? t('supplements.catalog.updating') : t('supplements.catalog.creating')}
      testID="supplement-form-modal"
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary"
            testID="btn-save-supplement"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text className="text-lg font-bold text-gray-800 text-center mb-4">
        {supplement ? t('supplements.catalog.editTitle') : t('supplements.catalog.addTitle')}
      </Text>

      <FormProvider {...methods}>
        <View className="gap-5">
          <ControlledInput
            name="name"
            label={t('supplements.catalog.nameLabel')}
            placeholder={t('supplements.catalog.namePlaceholder')}
            isRequired
            testID="supplement-name-input"
          />
          <ControlledSupplementUnitPicker />
          <ControlledInput
            name="defaultAmount"
            label={t('supplements.catalog.defaultAmountLabel')}
            placeholder={t('supplements.catalog.defaultAmountPlaceholder')}
            keyboardType="decimal-pad"
            testID="supplement-default-amount-input"
          />
          <ControlledSwatches name="color" label={t('supplements.catalog.colorLabel')} />
          <ControlledSupplementIconPicker name="icon" label={t('supplements.catalog.iconLabel')} accentColor={selectedColor} />
          <ControlledTextArea
            name="note"
            label={t('supplements.catalog.noteLabel')}
            placeholder={t('supplements.catalog.notePlaceholder')}
            testID="supplement-note-input"
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default SupplementFormModal;
