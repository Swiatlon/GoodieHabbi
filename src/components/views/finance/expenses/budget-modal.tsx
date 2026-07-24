import React, { useEffect } from 'react';
import { Control, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { BudgetPeriodEnum, IBudget, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateBudgetMutation, useUpdateBudgetMutation } from '@/redux/api/finance/finance-api';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';

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

  const methods = useForm<BudgetFormValues>({ defaultValues: { amount: '' } });
  const { control, handleSubmit, reset: resetForm } = methods;

  useEffect(() => {
    if (isVisible) resetForm({ amount: currentBudget ? String(currentBudget.limitAmount) : '' });
  }, [isVisible, currentBudget, resetForm]);

  const color = category?.color ?? DEFAULT_CATEGORY_COLOR;
  const icon = resolveCategoryIcon(category?.icon);

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

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating}
      loadingMessage={t('finance.expenses.savingBudget')}
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
    </Modal>
  );
};

export default BudgetModal;
