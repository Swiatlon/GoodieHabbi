import React, { useEffect, useState } from 'react';
import { Control, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker, { useDefaultClassNames } from 'react-native-ui-datepicker';
import { Ionicons } from '@expo/vector-icons';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';
import { useFinanceMonth } from '@/providers/finance/finance-month-context';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import {
  useCreateRecurringTransactionMutation,
  useCreateTransactionMutation,
  useGetFinanceCategoriesQuery,
  useUpdateTransactionMutation,
} from '@/redux/api/finance/finance-api';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { buildDatePickerClassNames, DATE_FORMAT, parseAmount } from '@/utils/finance/form-helpers';

interface AddTransactionModalProps extends IBaseModalProps {
  recentCategoryIds?: Partial<Record<FinanceTransactionTypeEnum, number[]>>;
  transaction?: ITransaction | null;
}

interface TransactionFormValues {
  amount: string;
  description: string;
}

const CHIP_ACTIVE_CLASS = 'border-primary bg-blue-50';
const CHIP_INACTIVE_CLASS = 'border-gray-200 bg-white';
const chipClass = (active: boolean) => (active ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS);
const chipTextClass = (active: boolean) => (active ? 'text-primary' : 'text-gray-600');
const getViewedMonthDefaultDate = (year: number, month: number) => {
  const monthStart = dayjs()
    .year(year)
    .month(month - 1)
    .date(1);
  // Always default to the start of the viewed month (so adding in future months works)
  return monthStart.format(DATE_FORMAT);
};

interface SubmitButtonProps {
  control: Control<TransactionFormValues>;
  isEditMode: boolean;
  hasCategory: boolean;
  onPress: () => void;
}

// Isolated so typing in the amount field only re-renders this button, not the whole category chip tree above.
const SubmitButton: React.FC<SubmitButtonProps> = ({ control, isEditMode, hasCategory, onPress }) => {
  const { t } = useTranslation();
  const amount = useWatch({ control, name: 'amount' });
  const parsedAmount = parseAmount(amount);
  const canSubmit = hasCategory && !isNaN(parsedAmount) && parsedAmount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!canSubmit}
      className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <Ionicons name={isEditMode ? 'checkmark-circle-outline' : 'add-circle-outline'} size={18} color="white" />
      <Text className="text-white font-semibold">{t(isEditMode ? 'finance.addTransaction.saveButton' : 'finance.addTransaction.addButton')}</Text>
    </TouchableOpacity>
  );
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isVisible, onClose, recentCategoryIds = {}, transaction = null }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [createRecurringTransaction] = useCreateRecurringTransactionMutation();
  const isLoading = isCreating || isUpdating;
  const isEditMode = transaction != null;
  const { year: viewedYear, month: viewedMonth } = useFinanceMonth();

  const methods = useForm<TransactionFormValues>({ defaultValues: { amount: '', description: '' } });
  const { control, handleSubmit, reset: resetForm } = methods;

  const [type, setType] = useState<FinanceTransactionTypeEnum>(FinanceTransactionTypeEnum.Expense);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [occurredOn, setOccurredOn] = useState(() => getViewedMonthDefaultDate(viewedYear, viewedMonth));
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isPaidValue, setIsPaidValue] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);

  const { data: categories = [] } = useGetFinanceCategoriesQuery({ type });
  const defaultDatePickerClassNames = useDefaultClassNames();

  useEffect(() => {
    if (!isVisible) return;

    if (transaction) {
      setType(transaction.type);
      resetForm({ amount: String(transaction.amount), description: transaction.note ?? '' });
      setOccurredOn(transaction.occurredOn);
      setIsPaidValue(transaction.isPaid);
    } else {
      setType(FinanceTransactionTypeEnum.Expense);
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
      resetForm({ amount: '', description: '' });
      setOccurredOn(getViewedMonthDefaultDate(viewedYear, viewedMonth));
      setIsPaidValue(true);
      setIsRecurring(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, transaction, viewedYear, viewedMonth]);

  useEffect(() => {
    if (!isVisible || !transaction || categories.length === 0) return;

    const topLevelMatch = categories.find(c => c.id === transaction.categoryId && !c.parentCategoryId);
    if (topLevelMatch) {
      setSelectedCategoryId(topLevelMatch.id);
      setSelectedSubcategoryId(null);
      return;
    }

    const parentMatch = categories.find(c => (c.subCategories ?? []).some(sub => sub.id === transaction.categoryId));
    if (parentMatch) {
      setSelectedCategoryId(parentMatch.id);
      setSelectedSubcategoryId(transaction.categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, transaction, categories]);

  const topLevelCategories = categories.filter(c => !c.parentCategoryId);
  const selectedCategory = topLevelCategories.find(c => c.id === selectedCategoryId) ?? null;
  const subCategories = selectedCategory?.subCategories ?? [];
  const recentCategories = (recentCategoryIds[type] ?? [])
    .map(id => topLevelCategories.find(c => c.id === id))
    .filter((c): c is IFinanceCategory => !!c);

  const isExpense = type === FinanceTransactionTypeEnum.Expense;
  const finalCategoryId = selectedSubcategoryId ?? selectedCategoryId;

  const reset = () => {
    setType(FinanceTransactionTypeEnum.Expense);
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    resetForm({ amount: '', description: '' });
    setOccurredOn(getViewedMonthDefaultDate(viewedYear, viewedMonth));
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectType = (nextType: FinanceTransactionTypeEnum) => {
    setType(nextType);
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
  };

  // Best-effort and isolated from the main flow: a recurring-template failure shouldn't undo — or even
  // look like it failed — the transaction that was already created successfully.
  const trySetupRecurring = async (categoryId: number, amount: number, note: string | undefined) => {
    try {
      await createRecurringTransaction({ type, categoryId, amount, note, dayOfMonth: dayjs(occurredOn).date() }).unwrap();
    } catch {
      showSnackbar({ text: t('finance.addTransaction.recurringSetupError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const onSubmit = async (values: TransactionFormValues) => {
    const parsedAmount = parseAmount(values.amount);
    if (!finalCategoryId || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const noteValue = values.description.trim() || undefined;
    const data = {
      type,
      amount: parsedAmount,
      categoryId: finalCategoryId,
      note: noteValue,
      occurredOn,
      isPaid: isExpense ? isPaidValue : true,
    };

    try {
      if (transaction) {
        await updateTransaction({ id: transaction.id, data }).unwrap();
        showSnackbar({
          text: isExpense ? t('finance.addTransaction.expenseUpdatedSuccess') : t('finance.addTransaction.incomeUpdatedSuccess'),
          variant: SnackbarVariantEnum.SUCCESS,
        });
      } else {
        await createTransaction(data).unwrap();
        showSnackbar({
          text: isExpense ? t('finance.addTransaction.expenseAddedSuccess') : t('finance.addTransaction.incomeAddedSuccess'),
          variant: SnackbarVariantEnum.SUCCESS,
        });
        if (isRecurring) await trySetupRecurring(finalCategoryId, parsedAmount, noteValue);
      }
      handleClose();
    } catch {
      showSnackbar({
        text: isEditMode ? t('finance.addTransaction.updatedError') : t('finance.addTransaction.addedError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      isLoading={isLoading}
      loadingMessage={t(isEditMode ? 'finance.addTransaction.updating' : 'finance.addTransaction.adding')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={handleClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <SubmitButton control={control} isEditMode={isEditMode} hasCategory={!!finalCategoryId} onPress={handleSubmit(onSubmit)} />
        </View>
      }
    >
      <FormProvider {...methods}>
        <View key={type}>
          <Text className="text-lg font-bold text-center mb-4">
            {t(isEditMode ? 'finance.addTransaction.editTitle' : 'finance.addTransaction.title')}
          </Text>

          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
            <ToggleTab active={isExpense} onPress={() => handleSelectType(FinanceTransactionTypeEnum.Expense)} className="py-2.5">
              <Text className={`text-sm font-bold ${isExpense ? 'text-red-500' : 'text-gray-500'}`}>{t('finance.addTransaction.expense')}</Text>
            </ToggleTab>
            <ToggleTab active={!isExpense} onPress={() => handleSelectType(FinanceTransactionTypeEnum.Income)} className="py-2.5">
              <Text className={`text-sm font-bold ${!isExpense ? 'text-green-600' : 'text-gray-500'}`}>{t('finance.addTransaction.income')}</Text>
            </ToggleTab>
          </View>

          {recentCategories.length > 0 && (
            <>
              <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.addTransaction.recentlyUsed')}</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {recentCategories.map(category => {
                  const active = selectedCategoryId === category.id;
                  return (
                    <TouchableOpacity
                      key={`recent-${category.id}`}
                      onPress={() => handleSelectCategory(category.id)}
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

          <Text className="text-sm font-semibold text-gray-600 mb-2">
            {isExpense ? t('finance.addTransaction.category') : t('finance.addTransaction.source')}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {topLevelCategories.map(category => {
              const active = selectedCategoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleSelectCategory(category.id)}
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

          {subCategories.length > 0 && (
            <>
              <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.addTransaction.subcategory')}</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {subCategories.map(sub => {
                  const active = selectedSubcategoryId === sub.id;
                  return (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => setSelectedSubcategoryId(sub.id)}
                      className={`px-3 py-2 rounded-xl border ${chipClass(active)}`}
                    >
                      <Text className={`text-xs font-semibold ${chipTextClass(active)}`}>{sub.name}</Text>
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
            testID="amount-input"
          />

          <Text className="text-sm font-semibold text-gray-600 mb-2 mt-3">{t('finance.addTransaction.date')}</Text>
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            className="flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-3 bg-white"
          >
            <Text className="text-base text-gray-800">{dayjs(occurredOn).format('DD.MM.YYYY')}</Text>
            <Ionicons name="calendar-outline" size={18} color="#6b7280" />
          </TouchableOpacity>

          {isExpense && (
            <>
              <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.paidStatus.label')}</Text>
              <View className="flex-row gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => setIsPaidValue(true)}
                  className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${chipClass(isPaidValue)}`}
                >
                  <Ionicons name="checkmark-circle-outline" size={14} color={isPaidValue ? '#1987EE' : '#6b7280'} />
                  <Text className={`text-xs font-semibold ${chipTextClass(isPaidValue)}`}>{t('finance.paidStatus.paid')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsPaidValue(false)}
                  className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${chipClass(!isPaidValue)}`}
                >
                  <Ionicons name="time-outline" size={14} color={!isPaidValue ? '#1987EE' : '#6b7280'} />
                  <Text className={`text-xs font-semibold ${chipTextClass(!isPaidValue)}`}>{t('finance.paidStatus.unpaid')}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <ControlledInput
            name="description"
            label={t('common.descriptionOptional')}
            placeholder={t('common.addNote')}
            maxLength={120}
            returnKeyType="done"
            testID="description-input"
          />

          {!isEditMode && (
            <View className="mt-3">
              <TouchableOpacity onPress={() => setIsRecurring(v => !v)} className="flex-row items-center gap-2" testID="recurring-toggle">
                <Ionicons name={isRecurring ? 'checkbox' : 'square-outline'} size={20} color={isRecurring ? '#1987EE' : '#d1d5db'} />
                <Text className="text-sm text-gray-600 flex-1">{t('finance.addTransaction.recurring')}</Text>
              </TouchableOpacity>
              {isRecurring && <Text className="text-xs text-gray-500 mt-1.5 ml-7">{t('finance.addTransaction.recurringHint')}</Text>}
            </View>
          )}
        </View>
      </FormProvider>

      <Modal isVisible={isDatePickerVisible} onClose={() => setDatePickerVisible(false)} className="pt-14 px-6">
        <DateTimePicker
          classNames={buildDatePickerClassNames(defaultDatePickerClassNames)}
          mode="single"
          date={occurredOn}
          onChange={({ date }) => {
            setOccurredOn(dayjs(date).format(DATE_FORMAT));
            setDatePickerVisible(false);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default AddTransactionModal;
