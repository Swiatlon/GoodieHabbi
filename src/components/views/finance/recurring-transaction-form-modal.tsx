import React, { useEffect, useState } from 'react';
import { Control, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import { FinanceTransactionTypeEnum, IRecurringTransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import {
  useCreateRecurringTransactionMutation,
  useGetFinanceCategoriesQuery,
  useUpdateRecurringTransactionMutation,
} from '@/redux/api/finance/finance-api';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { parseAmount } from '@/utils/finance/form-helpers';

/** The backend accepts 1..31 and materializes a too-large day on the last day of a short month. */
const MAX_DAY_OF_MONTH = 31;
const SHORT_MONTH_THRESHOLD = 29;
const DAY_OPTIONS = Array.from({ length: MAX_DAY_OF_MONTH }, (_, index) => index + 1);

const CHIP_ACTIVE_CLASS = 'border-primary bg-blue-50';
const CHIP_INACTIVE_CLASS = 'border-gray-200 bg-white';
const chipClass = (active: boolean) => (active ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS);
const chipTextClass = (active: boolean) => (active ? 'text-primary' : 'text-gray-600');

interface RecurringFormValues {
  amount: string;
  note: string;
}

interface RecurringTransactionFormModalProps extends IBaseModalProps {
  /** Null opens the form for a brand new template. */
  template: IRecurringTransaction | null;
}

interface SubmitButtonProps {
  control: Control<RecurringFormValues>;
  onPress: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ control, onPress }) => {
  const { t } = useTranslation();
  const amount = useWatch({ control, name: 'amount' });
  const parsedAmount = parseAmount(amount);
  // The backend rejects anything at or below zero, so the button mirrors that rule.
  const canSubmit = !isNaN(parsedAmount) && parsedAmount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!canSubmit}
      className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-300'}`}
      testID="recurring-form-submit"
    >
      <Ionicons name="checkmark-circle-outline" size={18} color="white" />
      <Text className="text-white font-semibold">{t('common.save')}</Text>
    </TouchableOpacity>
  );
};

const RecurringTransactionFormModal: React.FC<RecurringTransactionFormModalProps> = ({ isVisible, onClose, template }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createRecurring, { isLoading: isCreating }] = useCreateRecurringTransactionMutation();
  const [updateRecurring, { isLoading: isUpdating }] = useUpdateRecurringTransactionMutation();

  const isEditMode = template != null;
  const [type, setType] = useState<FinanceTransactionTypeEnum>(FinanceTransactionTypeEnum.Expense);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [isDayPickerVisible, setDayPickerVisible] = useState(false);

  const methods = useForm<RecurringFormValues>({ defaultValues: { amount: '', note: '' } });
  const { control, handleSubmit, reset: resetForm } = methods;

  const { data: categories = [] } = useGetFinanceCategoriesQuery({ type });

  useEffect(() => {
    if (!isVisible) return;

    if (template) {
      setType(template.type);
      setCategoryId(template.categoryId);
      setDayOfMonth(template.dayOfMonth);
      resetForm({ amount: String(template.amount), note: template.note ?? '' });
    } else {
      setType(FinanceTransactionTypeEnum.Expense);
      setCategoryId(null);
      setDayOfMonth(1);
      resetForm({ amount: '', note: '' });
    }
  }, [isVisible, template, resetForm]);

  const isExpense = type === FinanceTransactionTypeEnum.Expense;

  const handleSelectType = (next: FinanceTransactionTypeEnum) => {
    setType(next);
    // Categories are per type, so a category picked for the other one no longer applies.
    setCategoryId(null);
  };

  const onSubmit = async (values: RecurringFormValues) => {
    const parsedAmount = parseAmount(values.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const note = values.note.trim();

    try {
      if (template) {
        // Type and category are fixed after creation — the update contract only carries these four.
        // The note goes out as a (possibly empty) string on purpose: the endpoint reads `null` as
        // "leave unchanged", so sending null would silently keep a description the user just erased.
        await updateRecurring({ id: template.id, data: { amount: parsedAmount, note, dayOfMonth } }).unwrap();
      } else {
        await createRecurring({ type, amount: parsedAmount, categoryId, note: note || null, dayOfMonth }).unwrap();
      }
      showSnackbar({ text: t('finance.recurring.saved'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('finance.recurring.saveError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating}
      loadingMessage={t('finance.recurring.saving')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <SubmitButton control={control} onPress={handleSubmit(onSubmit)} />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View>
          <Text className="text-lg font-bold text-center mb-4">{t(isEditMode ? 'finance.recurring.editTitle' : 'finance.recurring.addTitle')}</Text>

          {/* The backend's update contract has no type or category field, so both are locked once saved. */}
          {!isEditMode && (
            <>
              <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
                <ToggleTab active={isExpense} onPress={() => handleSelectType(FinanceTransactionTypeEnum.Expense)} className="py-2.5">
                  <Text className={`text-sm font-bold ${isExpense ? 'text-red-500' : 'text-gray-500'}`}>{t('finance.addTransaction.expense')}</Text>
                </ToggleTab>
                <ToggleTab active={!isExpense} onPress={() => handleSelectType(FinanceTransactionTypeEnum.Income)} className="py-2.5">
                  <Text className={`text-sm font-bold ${!isExpense ? 'text-green-600' : 'text-gray-500'}`}>{t('finance.addTransaction.income')}</Text>
                </ToggleTab>
              </View>

              <Text className="text-sm font-semibold text-gray-600 mb-2">
                {isExpense ? t('finance.addTransaction.category') : t('finance.addTransaction.source')}
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {categories.map(category => {
                  const active = categoryId === category.id;

                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setCategoryId(active ? null : category.id)}
                      className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${chipClass(active)}`}
                    >
                      <Ionicons
                        name={resolveCategoryIcon(category.icon)}
                        size={14}
                        color={active ? '#1987EE' : (category.color ?? DEFAULT_CATEGORY_COLOR)}
                      />
                      <Text className={`text-xs font-semibold ${chipTextClass(active)}`}>{category.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <ControlledInput
            name="amount"
            label={t('common.amountPLN')}
            placeholder="0.00"
            keyboardType="decimal-pad"
            returnKeyType="next"
            testID="recurring-amount-input"
          />

          <Text className="text-sm font-semibold text-gray-600 mb-2 mt-3">{t('finance.recurring.dayLabel')}</Text>
          <TouchableOpacity
            onPress={() => setDayPickerVisible(true)}
            className="flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white"
            testID="recurring-day-picker"
          >
            <Text className="text-base text-gray-800">{t('finance.recurring.dayOfMonth', { day: dayOfMonth })}</Text>
            <Ionicons name="calendar-outline" size={18} color="#6b7280" />
          </TouchableOpacity>
          {dayOfMonth >= SHORT_MONTH_THRESHOLD && <Text className="text-xs text-gray-500 mt-1.5">{t('finance.recurring.shortMonthHint')}</Text>}

          <View className="mt-3">
            <ControlledInput name="note" label={t('finance.recurring.noteLabel')} placeholder={t('finance.recurring.notePlaceholder')} />
          </View>
        </View>
      </FormProvider>

      <Modal isVisible={isDayPickerVisible} onClose={() => setDayPickerVisible(false)} className="pt-10 px-6">
        <Text className="text-base font-bold text-center mb-3">{t('finance.recurring.dayLabel')}</Text>
        <ScrollView className="max-h-80">
          <View className="flex-row flex-wrap gap-2 justify-center pb-2">
            {DAY_OPTIONS.map(day => {
              const active = day === dayOfMonth;

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => {
                    setDayOfMonth(day);
                    setDayPickerVisible(false);
                  }}
                  className={`w-11 h-11 items-center justify-center rounded-xl border ${chipClass(active)}`}
                >
                  <Text className={`text-sm font-semibold ${chipTextClass(active)}`}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Modal>
    </Modal>
  );
};

export default RecurringTransactionFormModal;
