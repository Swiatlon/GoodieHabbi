import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { formatPLN } from '@/utils/finance/format-pln';
import { useFinanceDisplay } from '@/providers/finance-display-context';

interface MonthlyOverviewCardProps {
  totalSpent: number;
  totalSaved: number;
  totalCommitted: number;
  totalBudget: number;
  isOver: boolean;
  progress: number;
  sumCategoryBudgets: number;
  allocationDiff: number;
}

const MonthlyOverviewCard: React.FC<MonthlyOverviewCardProps> = ({
  totalSpent,
  totalSaved,
  totalCommitted,
  totalBudget,
  isOver,
  progress,
  sumCategoryBudgets,
  allocationDiff,
}) => {
  const { t } = useTranslation();
  const { hideNumbers } = useFinanceDisplay();
  const mask = (v: string) => (hideNumbers ? '***' : v);
  // The bar shows the portion of the budget actually committed this month,
  // including savings/investments, while the spent amount remains the true consumption figure.

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('finance.dashboard.monthlyOverview')}</Text>
      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-xs text-gray-500">{t('finance.dashboard.spent')}</Text>
          <Text className={`text-xl font-bold ${isOver ? 'text-red-500' : 'text-gray-800'}`}>{mask(formatPLN(totalSpent))}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500">{t('finance.dashboard.budget')}</Text>
          <Text className="text-xl font-bold text-gray-800">{totalBudget > 0 ? mask(formatPLN(totalBudget)) : '—'}</Text>
          {totalBudget > 0 && <Text className="text-xs text-gray-400">{t('finance.dashboard.budgetFromIncome')}</Text>}
        </View>
      </View>
      {totalBudget > 0 && (
        <>
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <View className="h-full" style={{ width: `${progress * 100}%`, backgroundColor: isOver ? '#EF4444' : '#1987EE' }} />
          </View>
          <View className="flex-row justify-between mt-1.5">
            <Text className="text-xs text-gray-500">{t('finance.dashboard.percentUsed', { percent: Math.round(progress * 100) })}</Text>
            {isOver ? (
                <Text className="text-xs text-red-500 font-semibold">
                {t('finance.dashboard.overBudget', { amount: mask(formatPLN(totalCommitted - totalBudget)) })}
              </Text>
            ) : (
                <Text className="text-xs text-gray-600 font-medium">
                {t('finance.dashboard.remaining', { amount: mask(formatPLN(totalBudget - totalCommitted)) })}
              </Text>
            )}
          </View>
          {totalSaved > 0 && (
            <Text className="text-[11px] text-emerald-600 mt-1">{t('finance.dashboard.includingSaved', { amount: mask(formatPLN(totalSaved)) })}</Text>
          )}
          {sumCategoryBudgets > 0 && Math.abs(allocationDiff) >= 1 && (
            <Text className={`text-xs mt-2 ${allocationDiff < 0 ? 'text-amber-600' : 'text-gray-400'}`}>
              {allocationDiff < 0
                ? t('finance.dashboard.categoriesOverAllocated', { amount: mask(formatPLN(Math.abs(allocationDiff))) })
                : t('finance.dashboard.categoriesUnallocated', { amount: mask(formatPLN(allocationDiff)) })}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default MonthlyOverviewCard;
