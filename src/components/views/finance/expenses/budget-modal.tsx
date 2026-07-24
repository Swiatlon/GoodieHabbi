import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const BudgetModal: React.FC<BudgetModalProps> = ({ isVisible, onClose, category, currentBudget, year, month }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isVisible) setAmount(currentBudget ? String(currentBudget.limitAmount) : '');
  }, [isVisible, currentBudget]);

  const color = category?.color ?? DEFAULT_CATEGORY_COLOR;
  const icon = resolveCategoryIcon(category?.icon);

  const parsedAmount = parseFloat(amount.replace(',', '.'));
  const canSubmit = !!category && !isNaN(parsedAmount) && parsedAmount >= 0;

  const handleSave = async () => {
    if (!canSubmit) return;

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
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSubmit}
            className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('common.save')}</Text>
          </TouchableOpacity>
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

      <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.expenses.monthlyBudget')}</Text>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        autoFocus
      />
    </Modal>
  );
};

export default BudgetModal;
