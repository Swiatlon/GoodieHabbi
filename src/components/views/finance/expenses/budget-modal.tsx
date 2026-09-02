import React, { useEffect } from 'react';
import { Control, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMonthlyHistory } from '../budget-planner/use-monthly-history';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { BudgetPeriodEnum, IBudget, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateBudgetMutation, useDeleteBudgetMutation, useUpdateBudgetMutation } from '@/redux/api/finance/finance-api';
import { collectCategoryIds, DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { parseAmount } from '@/utils/finance/form-helpers';
import { formatPLN } from '@/utils/finance/format-pln';
import { amountForCategoryIds, BUDGET_HISTORY_MONTHS, suggestBudgetAmount } from '@/utils/finance/summary-helpers';

interface BudgetModalProps extends IBaseModalProps {
  category: IFinanceCategory | null;
  currentBudget: IBudget | null;
  year: number;
  month: number;
}

interface BudgetFormValues {
  amount: string;
}

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
  const history = useMonthlyHistory(year, month, !shouldFetchHistory);

  const categoryIds = category ? new Set(collectCategoryIds(category)) : null;
  const suggestion = categoryIds
    ? suggestBudgetAmount(history.map(summary => amountForCategoryIds(summary, categoryIds)))
    : { amount: 0, isIrregular: false, peak: 0, hasHistory: false };
  const showSuggestion = shouldFetchHistory && suggestion.amount > 0;

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
          onPress={() => setValue('amount', String(suggestion.amount))}
          className="flex-row items-center gap-1.5 mt-2"
          testID="budget-suggestion-button"
        >
          <Ionicons name={suggestion.isIrregular ? 'flash-outline' : 'bulb-outline'} size={14} color="#F59E0B" />
          <Text className="text-xs text-amber-600">
            {suggestion.isIrregular
              ? t('finance.expenses.suggestedBudgetIrregular', {
                  amount: formatPLN(suggestion.amount),
                  peak: formatPLN(suggestion.peak),
                  months: BUDGET_HISTORY_MONTHS,
                })
              : t('finance.expenses.suggestedBudget', { amount: formatPLN(suggestion.amount), months: BUDGET_HISTORY_MONTHS })}
          </Text>
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
