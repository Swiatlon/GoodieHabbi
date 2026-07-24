import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { formatPLN } from '@/utils/finance/format-pln';

interface MonthlyOverviewCardProps {
  totalSpent: number;
  totalBudget: number;
  isOver: boolean;
  progress: number;
  sumCategoryBudgets: number;
  allocationDiff: number;
}

const MonthlyOverviewCard: React.FC<MonthlyOverviewCardProps> = ({
  totalSpent,
  totalBudget,
  isOver,
  progress,
  sumCategoryBudgets,
  allocationDiff,
}) => {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('finance.dashboard.monthlyOverview')}</Text>
      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-xs text-gray-500">{t('finance.dashboard.spent')}</Text>
          <Text className={`text-xl font-bold ${isOver ? 'text-red-500' : 'text-gray-800'}`}>{formatPLN(totalSpent)}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500">{t('finance.dashboard.budget')}</Text>
          <Text className="text-xl font-bold text-gray-800">{totalBudget > 0 ? formatPLN(totalBudget) : '—'}</Text>
          {totalBudget > 0 && <Text className="text-xs text-gray-400">{t('finance.dashboard.budgetFromIncome')}</Text>}
        </View>
      </View>
      {totalBudget > 0 && (
        <>
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <View className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: isOver ? '#EF4444' : '#1987EE' }} />
          </View>
          <View className="flex-row justify-between mt-1.5">
            <Text className="text-xs text-gray-500">{t('finance.dashboard.percentUsed', { percent: Math.round(progress * 100) })}</Text>
            {isOver ? (
              <Text className="text-xs text-red-500 font-semibold">
                {t('finance.dashboard.overBudget', { amount: formatPLN(totalSpent - totalBudget) })}
              </Text>
            ) : (
              <Text className="text-xs text-gray-600 font-medium">
                {t('finance.dashboard.remaining', { amount: formatPLN(totalBudget - totalSpent) })}
              </Text>
            )}
          </View>
          {sumCategoryBudgets > 0 && Math.abs(allocationDiff) >= 1 && (
            <Text className={`text-xs mt-2 ${allocationDiff < 0 ? 'text-amber-600' : 'text-gray-400'}`}>
              {allocationDiff < 0
                ? t('finance.dashboard.categoriesOverAllocated', { amount: formatPLN(Math.abs(allocationDiff)) })
                : t('finance.dashboard.categoriesUnallocated', { amount: formatPLN(allocationDiff) })}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default MonthlyOverviewCard;
