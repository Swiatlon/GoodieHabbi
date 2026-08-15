import React, { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSupplementSlotValidationSchema } from './schema';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledTextArea from '@/components/shared/text-area/controlled-text-area';
import ControlledSupplementTimingPicker from '@/components/views/supplements/reusable/supplement-timing-picker';
import { ISupplement, ISupplementSlot, SupplementTimingEnum } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpsertSupplementSlotMutation } from '@/redux/api/supplements/catalog-api';
import { IApiError } from '@/types/global-types';

interface SlotFormModalProps extends IBaseModalProps {
  supplement: ISupplement;
  slot: ISupplementSlot | null;
}

interface SlotFormValues {
  timing: SupplementTimingEnum;
  amount: string;
  timeOfDay: string | null;
  offsetMinutes: string;
  note: string | null;
}

const DEFAULT_VALUES: SlotFormValues = { timing: SupplementTimingEnum.Morning, amount: '', timeOfDay: null, offsetMinutes: '', note: null };

const parseNumber = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsed = parseFloat(value.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
};

const SlotFormModal: React.FC<SlotFormModalProps> = ({ isVisible, onClose, supplement, slot }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [upsertSlot, { isLoading }] = useUpsertSupplementSlotMutation();
  const validationSchema = useSupplementSlotValidationSchema();

  const methods = useForm<SlotFormValues>({ resolver: yupResolver(validationSchema), defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset: resetForm, control } = methods;
  const timing = useWatch({ control, name: 'timing' });
  const isWorkoutRelated = timing === SupplementTimingEnum.PreWorkout || timing === SupplementTimingEnum.PostWorkout;

  useEffect(() => {
    if (!isVisible) return;

    resetForm(
      slot
        ? {
            timing: slot.timing,
            amount: String(slot.amount),
            timeOfDay: slot.timeOfDay,
            offsetMinutes: slot.offsetMinutes != null ? String(slot.offsetMinutes) : '',
            note: slot.note,
          }
        : DEFAULT_VALUES
    );
  }, [isVisible, slot, resetForm]);

  const onSubmit = async (values: SlotFormValues) => {
    try {
      await upsertSlot({
        supplementId: supplement.id,
        slotId: slot?.id,
        slot: {
          timing: values.timing,
          amount: parseNumber(values.amount) ?? 0,
          timeOfDay: values.timing === SupplementTimingEnum.Custom ? values.timeOfDay : null,
          offsetMinutes: parseNumber(values.offsetMinutes),
          note: values.note?.trim() || null,
        },
      }).unwrap();
      showSnackbar({ text: t('supplements.catalog.slotSavedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('supplements.catalog.slotSavedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isLoading}
      loadingMessage={t('supplements.catalog.updating')}
      testID="slot-form-modal"
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary"
            testID="btn-save-slot"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text className="text-lg font-bold text-gray-800 text-center mb-4">
        {slot ? t('supplements.catalog.editSlotTitle') : t('supplements.catalog.addSlotTitle')}
      </Text>

      <FormProvider {...methods}>
        <View className="gap-5">
          <ControlledSupplementTimingPicker />
          {timing === SupplementTimingEnum.Custom && (
            <ControlledInput
              name="timeOfDay"
              label={t('supplements.catalog.timeOfDayLabel')}
              placeholder="HH:mm:ss"
              testID="slot-time-of-day-input"
            />
          )}
          {isWorkoutRelated && (
            <ControlledInput
              name="offsetMinutes"
              label={t('supplements.catalog.offsetMinutesLabel')}
              placeholder={t('supplements.catalog.offsetMinutesPlaceholder')}
              keyboardType="numeric"
              testID="slot-offset-minutes-input"
            />
          )}
          <ControlledInput
            name="amount"
            label={`${t('supplements.catalog.amountLabel')} (${t(`supplements.enums.unit.${supplement.unit}`)})`}
            placeholder="0"
            keyboardType="decimal-pad"
            isRequired
            testID="slot-amount-input"
          />
          <ControlledTextArea
            name="note"
            label={t('supplements.catalog.noteLabel')}
            placeholder={t('supplements.catalog.notePlaceholder')}
            testID="slot-note-input"
          />
        </View>
      </FormProvider>
    </Modal>
  );
};

export default SlotFormModal;
