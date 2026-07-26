import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { Ionicons } from '@expo/vector-icons';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import dayjs from '@/configs/day-js-config';
import { ITransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useAddCorrectionMutation } from '@/redux/api/finance/finance-api';
import { formatPLN } from '@/utils/finance/format-pln';

interface AddCorrectionModalProps extends IBaseModalProps {
  transaction: ITransaction | null;
}

interface CorrectionFormValues {
  amount: string;
  description: string;
}

const DATE_FORMAT = 'YYYY-MM-DD';
const todayString = () => dayjs().format(DATE_FORMAT);
const parseAmount = (value: string) => parseFloat(value.replace(',', '.'));

// The server's 409s explain exactly what went wrong (over-correcting, correcting a correction), so surface
// them verbatim rather than replacing them with a generic failure message.
const getServerMessage = (error: unknown): string | null => {
  const message = (error as { data?: { message?: unknown } } | undefined)?.data?.message;
  return typeof message === 'string' && message.length > 0 ? message : null;
};

const AddCorrectionModal: React.FC<AddCorrectionModalProps> = ({ isVisible, onClose, transaction }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [addCorrection, { isLoading }] = useAddCorrectionMutation();

  const methods = useForm<CorrectionFormValues>({ defaultValues: { amount: '', description: '' } });
  const { control, handleSubmit, reset: resetForm } = methods;

  const [occurredOn, setOccurredOn] = useState(todayString);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    resetForm({ amount: '', description: '' });
    setOccurredOn(todayString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, transaction]);

  const amount = useWatch({ control, name: 'amount' });
  const remaining = transaction ? transaction.amount - transaction.correctedAmount : 0;
  const parsedAmount = parseAmount(amount);
  const canSubmit = !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= remaining;

  const handleClose = () => {
    resetForm({ amount: '', description: '' });
    setOccurredOn(todayString());
    onClose();
  };

  const onSubmit = async (values: CorrectionFormValues) => {
    if (!transaction || !canSubmit) return;

    try {
      await addCorrection({
        id: transaction.id,
        data: {
          amount: parseAmount(values.amount),
          occurredOn,
          note: values.description.trim() || undefined,
        },
      }).unwrap();
      showSnackbar({ text: t('finance.corrections.addedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      handleClose();
    } catch (error) {
      showSnackbar({ text: getServerMessage(error) ?? t('finance.corrections.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      isLoading={isLoading}
      loadingMessage={t('finance.corrections.adding')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={handleClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!canSubmit}
            className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <Ionicons name="arrow-undo-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('finance.corrections.addButton')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <FormProvider {...methods}>
        <View>
          <Text className="text-lg font-bold text-center mb-4">{t('finance.corrections.title')}</Text>

          {/* Type and category are inherited from the corrected transaction, so this modal only ever asks for
              amount, date and note — no toggle, no category grid. */}
          <View className="bg-gray-50 rounded-xl p-3 mb-4 gap-1">
            <Text className="text-xs text-gray-500">{t('finance.corrections.originalAmount')}</Text>
            <Text className="text-base font-bold text-gray-800">{formatPLN(transaction?.amount ?? 0)}</Text>
            {transaction?.note ? (
              <Text className="text-xs text-gray-500 italic" numberOfLines={1}>
                {transaction.note}
              </Text>
            ) : null}
            <Text className="text-xs text-gray-500 mt-1">{t('finance.corrections.remaining', { amount: formatPLN(remaining) })}</Text>
          </View>

          <ControlledInput
            name="amount"
            label={t('finance.corrections.amountLabel')}
            placeholder="0.00"
            keyboardType="decimal-pad"
            returnKeyType="next"
            testID="correction-amount-input"
          />

          <Text className="text-sm font-semibold text-gray-600 mb-2 mt-3">{t('finance.corrections.date')}</Text>
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            className="flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-3 bg-white"
          >
            <Text className="text-base text-gray-800">{dayjs(occurredOn).format('DD.MM.YYYY')}</Text>
            <Ionicons name="calendar-outline" size={18} color="#6b7280" />
          </TouchableOpacity>

          <ControlledInput
            name="description"
            label={t('common.descriptionOptional')}
            placeholder={t('common.addNote')}
            maxLength={120}
            returnKeyType="done"
            testID="correction-description-input"
          />
        </View>
      </FormProvider>

      <Modal isVisible={isDatePickerVisible} onClose={() => setDatePickerVisible(false)} className="pt-14 px-6">
        <DateTimePicker
          mode="single"
          date={occurredOn}
          maxDate={todayString()}
          onChange={({ date }) => {
            setOccurredOn(dayjs(date).format(DATE_FORMAT));
            setDatePickerVisible(false);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default AddCorrectionModal;
