import React, { useEffect } from 'react';
import { Control, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import dayjs from '@/configs/day-js-config';
import { BudgetPeriodEnum, IBudget, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import {
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useGetMonthlySummaryQuery,
  useUpdateBudgetMutation,
} from '@/redux/api/finance/finance-api';
import { collectCategoryIds, DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

interface BudgetModalProps extends IBaseModalProps {
  category: IFinanceCategory | null;
  currentBudget: IBudget | null;
  year: number;
  month: number;
}

interface BudgetFormValues {
  amount: string;
}

const parseAmount = (value: string) => parseFloat(value.replace(',', '.'));

const HISTORY_MONTHS = 3;

// months-ago (1..HISTORY_MONTHS) relative to the viewed year/month, wrapping across year boundaries.
const getPastMonth = (year: number, month: number, monthsAgo: number) => {
  const target = dayjs()
    .year(year)
    .month(month - 1)
    .subtract(monthsAgo, 'month');
  return { year: target.year(), month: target.month() + 1 };
};

interface SubmitButtonProps {
  control: Control<BudgetFormValues>;
  hasCategory: boolean;
  onPress: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ control, hasCategory, onPress }) => {
  const { t } = useTranslation();
  const amount = useWatch({ control, name: 'amount' });
  const parsedAmount = parseAmount(amount);
  const canSubmit = hasCategory && !isNaN(parsedAmount) && parsedAmount >= 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!canSubmit}
      className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <Ionicons name="checkmark-circle-outline" size={18} color="white" />
      <Text className="text-white font-semibold">{t('common.save')}</Text>
    </TouchableOpacity>
  );
};

const BudgetModal: React.FC<BudgetModalProps> = ({ isVisible, onClose, category, currentBudget, year, month }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
  const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();

  const methods = useForm<BudgetFormValues>({ defaultValues: { amount: '' } });
  const { control, handleSubmit, reset: resetForm, setValue } = methods;

  useEffect(() => {
    if (isVisible) resetForm({ amount: currentBudget ? String(currentBudget.limitAmount) : '' });
  }, [isVisible, currentBudget, resetForm]);

  const color = category?.color ?? DEFAULT_CATEGORY_COLOR;
  const icon = resolveCategoryIcon(category?.icon);

  // Only worth suggesting when there's no budget yet — once one exists the user is adjusting it deliberately.
  const shouldFetchHistory = isVisible && !!category && !currentBudget;
  const pastMonth1 = getPastMonth(year, month, 1);
  const pastMonth2 = getPastMonth(year, month, 2);
  const pastMonth3 = getPastMonth(year, month, 3);
  const { data: summary1 } = useGetMonthlySummaryQuery(pastMonth1, { skip: !shouldFetchHistory });
  const { data: summary2 } = useGetMonthlySummaryQuery(pastMonth2, { skip: !shouldFetchHistory });
  const { data: summary3 } = useGetMonthlySummaryQuery(pastMonth3, { skip: !shouldFetchHistory });

  const categoryIds = category ? new Set(collectCategoryIds(category)) : null;
  const spendFor = (summary?: { expenseByCategory: { categoryId: number | null; amount: number }[] }) => {
    if (!categoryIds) return 0;
    return (summary?.expenseByCategory ?? [])
      .filter(item => item.categoryId != null && categoryIds.has(item.categoryId))
      .reduce((sum, item) => sum + item.amount, 0);
  };
  const suggestedAmount = shouldFetchHistory ? Math.round((spendFor(summary1) + spendFor(summary2) + spendFor(summary3)) / HISTORY_MONTHS) : 0;
  const showSuggestion = shouldFetchHistory && suggestedAmount > 0;

  const onSubmit = async (values: BudgetFormValues) => {
    const parsedAmount = parseAmount(values.amount);
    if (!category || isNaN(parsedAmount) || parsedAmount < 0) return;

    try {
      if (currentBudget) {
        await updateBudget({ id: currentBudget.id, data: { limitAmount: parsedAmount } }).unwrap();
      } else {
        await createBudget({ categoryId: category.id, period: BudgetPeriodEnum.Monthly, year, month, limitAmount: parsedAmount }).unwrap();
      }
      showSnackbar({ text: t('finance.expenses.budgetUpdated'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('finance.expenses.budgetError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleDelete = () => {
    if (!currentBudget) return;

    Alert.alert(t('finance.expenses.deleteBudgetTitle'), t('finance.expenses.deleteBudgetMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBudget({ id: currentBudget.id }).unwrap();
            showSnackbar({ text: t('finance.expenses.budgetDeleted'), variant: SnackbarVariantEnum.SUCCESS });
            onClose();
          } catch {
            showSnackbar({ text: t('finance.expenses.budgetDeleteError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating || isDeleting}
      loadingMessage={isDeleting ? t('finance.expenses.deletingBudget') : t('finance.expenses.savingBudget')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <SubmitButton control={control} hasCategory={!!category} onPress={handleSubmit(onSubmit)} />
        </View>
      }
    >
      <View className="items-center mb-4">
        {category && (
          <View className="w-14 h-14 rounded-2xl items-center justify-center mb-3" style={{ backgroundColor: `${color}18` }}>
            <Ionicons name={icon} size={28} color={color} />
          </View>
        )}
        <Text className="text-lg font-bold text-gray-800">{t('finance.expenses.setBudgetTitle')}</Text>
        {category && <Text className="text-sm text-gray-500">{category.name}</Text>}
      </View>

      <FormProvider {...methods}>
        <ControlledInput
          name="amount"
          label={t('finance.expenses.monthlyBudget')}
          placeholder="0.00"
          keyboardType="decimal-pad"
          autoFocus
          testID="budget-amount-input"
        />
      </FormProvider>

      {showSuggestion && (
        <TouchableOpacity
          onPress={() => setValue('amount', String(suggestedAmount))}
          className="flex-row items-center gap-1.5 mt-2"
          testID="budget-suggestion-button"
        >
          <Ionicons name="bulb-outline" size={14} color="#F59E0B" />
          <Text className="text-xs text-amber-600">{t('finance.expenses.suggestedBudget', { amount: formatPLN(suggestedAmount) })}</Text>
        </TouchableOpacity>
      )}

      {/* Removing the budget is different from setting it to 0: a 0 limit still shows a progress bar that is
          instantly over, whereas no budget falls back to the plain "no budget set" hint. */}
      {currentBudget && (
        <TouchableOpacity onPress={handleDelete} className="flex-row items-center justify-center gap-1.5 mt-4 py-2" testID="budget-delete-button">
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text className="text-sm font-semibold text-red-500">{t('finance.expenses.deleteBudget')}</Text>
        </TouchableOpacity>
      )}
    </Modal>
  );
};

export default BudgetModal;
