import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { formatPLN } from '@/utils/finance/format-pln';

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

interface StatBadgeProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bgClassName: string;
  label: string;
}

// Same visual language as UnpaidBadge (finance/shared) — icon + short bold text on a tinted pill — so a
// glance at the color/icon is enough, instead of reading a paragraph of stacked gray sentences.
const StatBadge: React.FC<StatBadgeProps> = ({ icon, color, bgClassName, label }) => (
  <View className={`flex-row items-center gap-1 px-1.5 py-0.5 rounded ${bgClassName}`}>
    <Ionicons name={icon} size={10} color={color} />
    <Text className="text-[10px] font-semibold" style={{ color }}>
      {label}
    </Text>
  </View>
);

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
  const { mask } = useFinanceDisplay();
  const [showDetails, setShowDetails] = useState(false);
  // The bar shows the portion of the budget actually committed this month,
  // including savings/investments, while the spent amount remains the true consumption figure.
  const hasAllocationDetail = sumCategoryBudgets > 0 && Math.abs(allocationDiff) >= 1;

  // Split the bar into what was actually spent vs. what was moved to savings/investments, instead of one
  // solid color for both — otherwise a month that's mostly savings (e.g. a stock purchase) reads as "almost
  // out of budget" at a glance, even though real spending is small.
  const realSpent = Math.max(0, totalSpent - totalSaved);
  const spentPct = totalBudget > 0 ? Math.min(realSpent / totalBudget, 1) * 100 : 0;
  const combinedPct = totalBudget > 0 ? Math.min((realSpent + totalSaved) / totalBudget, 1) * 100 : 0;
  const savedPct = Math.max(0, combinedPct - spentPct);

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('finance.dashboard.monthlyOverview')}</Text>
      <View className="flex-row justify-between mb-3">
        <View className="gap-1">
          <Text className="text-xs text-gray-500">{t('finance.dashboard.spent')}</Text>
          {/* The headline is real consumption: money moved into savings/investments is not spending,
              so burying it in a sub-label made the number that matters the harder one to read. */}
          <Text className={`text-xl font-bold ${isOver ? 'text-red-500' : 'text-gray-800'}`}>{mask(formatPLN(realSpent))}</Text>
          {totalSaved > 0 && (
            <StatBadge
              icon="wallet-outline"
              color="#6b7280"
              bgClassName="bg-gray-100"
              label={t('finance.dashboard.spentIncludingSavings', { amount: mask(formatPLN(totalSpent)) })}
            />
          )}
        </View>
        <View className="items-end gap-1">
          <Text className="text-xs text-gray-500">{t('finance.dashboard.budget')}</Text>
          <Text className="text-xl font-bold text-gray-800">{totalBudget > 0 ? mask(formatPLN(totalBudget)) : '—'}</Text>
          {totalBudget > 0 && (
            <StatBadge icon="cash-outline" color="#6b7280" bgClassName="bg-gray-100" label={t('finance.dashboard.budgetFromIncome')} />
          )}
        </View>
      </View>
      {totalBudget > 0 && (
        <>
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex-row">
            <View className="h-full" style={{ width: `${spentPct}%`, backgroundColor: isOver ? '#EF4444' : '#1987EE' }} />
            {savedPct > 0 && <View className="h-full" style={{ width: `${savedPct}%`, backgroundColor: '#10B981' }} />}
          </View>
          <View className="flex-row items-center justify-between mt-2">
            {isOver ? (
              <StatBadge
                icon="alert-circle-outline"
                color="#EF4444"
                bgClassName="bg-red-50"
                label={t('finance.dashboard.overBudget', { amount: mask(formatPLN(totalCommitted - totalBudget)) })}
              />
            ) : (
              <StatBadge
                icon="checkmark-circle-outline"
                color="#059669"
                bgClassName="bg-emerald-50"
                label={t('finance.dashboard.remaining', { amount: mask(formatPLN(totalBudget - totalCommitted)) })}
              />
            )}
            <TouchableOpacity
              onPress={() => setShowDetails(v => !v)}
              className="flex-row items-center gap-0.5 px-1 py-1"
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityLabel={t('finance.dashboard.detailsToggle')}
            >
              <Text className="text-[10px] text-gray-400 font-medium">{t('finance.dashboard.details')}</Text>
              <Ionicons name={showDetails ? 'chevron-up' : 'chevron-down'} size={12} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          {showDetails && (
            <View className="flex-row flex-wrap gap-1.5 mt-1.5">
              <StatBadge
                icon="stats-chart-outline"
                color="#1987EE"
                bgClassName="bg-blue-50"
                label={t('finance.dashboard.percentUsed', { percent: Math.round(progress * 100) })}
              />
              {hasAllocationDetail && (
                <StatBadge
                  icon={allocationDiff < 0 ? 'warning-outline' : 'information-circle-outline'}
                  color={allocationDiff < 0 ? '#D97706' : '#9CA3AF'}
                  bgClassName={allocationDiff < 0 ? 'bg-amber-50' : 'bg-gray-50'}
                  label={
                    allocationDiff < 0
                      ? t('finance.dashboard.categoriesOverAllocated', { amount: mask(formatPLN(Math.abs(allocationDiff))) })
                      : t('finance.dashboard.categoriesUnallocated', { amount: mask(formatPLN(allocationDiff)) })
                  }
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default MonthlyOverviewCard;
