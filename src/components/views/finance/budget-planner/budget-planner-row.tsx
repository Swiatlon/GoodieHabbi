import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IBudget, IFinanceCategory } from '@/contract/finance/finance.contract';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';
import { BUDGET_HISTORY_MONTHS, IBudgetSuggestion } from '@/utils/finance/summary-helpers';

interface BudgetPlannerRowProps {
  category: IFinanceCategory;
  budget: IBudget | null;
  suggestion: IBudgetSuggestion;
  onPress: () => void;
}

// One row per top-level category, always rendered — unlike CategoryCard on the Dashboard, which hides a
// category with no activity/budget this month. Here that's the whole point: a category with zero activity
// this month is exactly the one the user hasn't planned for yet.
const BudgetPlannerRow: React.FC<BudgetPlannerRowProps> = ({ category, budget, suggestion, onPress }) => {
  const { t } = useTranslation();
  const { mask } = useFinanceDisplay();
  const color = category.color ?? DEFAULT_CATEGORY_COLOR;
  const icon = resolveCategoryIcon(category.icon);
  const hasBudget = !!budget && budget.limitAmount > 0;
  const effectiveAmount = hasBudget ? budget!.limitAmount : suggestion.amount;

  const subtitle = !suggestion.hasHistory
    ? t('finance.budgetPlanner.noHistory')
    : suggestion.isIrregular
      ? t('finance.budgetPlanner.historyIrregular', { peak: mask(formatPLN(suggestion.peak)), amount: mask(formatPLN(suggestion.amount)) })
      : t('finance.budgetPlanner.historyTypical', { months: BUDGET_HISTORY_MONTHS, amount: mask(formatPLN(suggestion.amount)) });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-4 py-3 bg-white rounded-2xl shadow-sm mb-2"
      testID={`budget-planner-row-${category.id}`}
    >
      <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: `${color}20` }}>
        <Ionicons name={icon} size={16} color={color} />
      </View>

      <View className="flex-1 gap-0.5 pr-2">
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
            {category.name}
          </Text>
          {suggestion.isIrregular && <Ionicons name="flash-outline" size={12} color="#F59E0B" />}
        </View>
        <Text className="text-xs text-gray-400" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View className="items-end gap-0.5">
        <Text className="text-sm font-bold" style={{ color: hasBudget ? '#1a1a2e' : color }}>
          {mask(formatPLN(effectiveAmount))}
        </Text>
        {effectiveAmount > 0 && (
          <View className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: hasBudget ? '#EFF6FF' : '#FFFBEB' }}>
            <Text className="text-[9px] font-bold uppercase" style={{ color: hasBudget ? '#1987EE' : '#F59E0B' }}>
              {hasBudget ? t('finance.budgetPlanner.plannedBadge') : t('finance.budgetPlanner.suggestedBadge')}
            </Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={16} color="#d1d5db" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
  );
};

export default BudgetPlannerRow;
