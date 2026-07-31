import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KpiCard from './kpi-card';
import { IBudgetProgressItem, IFinanceCategory, IMonthlySummary } from '@/contract/finance/finance.contract';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { buildCategoriesById, getCategoryVisual, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatK } from '@/utils/finance/format-k';
import { formatPLN } from '@/utils/finance/format-pln';
import { getSavingsAmount } from '@/utils/finance/summary-helpers';

interface MonthOverviewProps {
  summary: IMonthlySummary;
  prevSummary: IMonthlySummary | null;
  budgetProgress: IBudgetProgressItem[];
  categories: IFinanceCategory[];
}

const MonthOverview: React.FC<MonthOverviewProps> = ({ summary, prevSummary, budgetProgress, categories }) => {
  const { t } = useTranslation();
  const { mask } = useFinanceDisplay();
  const uncategorizedLabel = t('finance.history.uncategorized');

  const categoriesById = buildCategoriesById(categories);
  const savingsCategoryIds = getSavingsCategoryIds(categories);

  const getSavedAmount = (s: IMonthlySummary) => getSavingsAmount(s.expenseByCategory, savingsCategoryIds);

  const totalSaved = getSavedAmount(summary);
  const totalSpent = summary.totalExpense;
  const totalIncome = summary.totalIncome;
  const balance = summary.net;
  const hasData = totalIncome > 0 || totalSpent > 0 || totalSaved > 0;

  const prevTotalSpent = prevSummary ? prevSummary.totalExpense : 0;
  const spentDelta = totalSpent - prevTotalSpent;
  const spentDeltaText =
    !prevSummary || spentDelta === 0
      ? undefined
      : spentDelta > 0
        ? t('finance.statistics.moreThanLastMonth', { amount: mask(formatK(Math.abs(spentDelta))) })
        : t('finance.statistics.lessThanLastMonth', { amount: mask(formatK(Math.abs(spentDelta))) });

  const spendingBreakdown = summary.expenseByCategory.filter(item => item.categoryId != null && !savingsCategoryIds.has(item.categoryId));
  const spendingBudgetProgress = budgetProgress.filter(item => item.categoryId != null && !savingsCategoryIds.has(item.categoryId));
  const budgetedCategoryIds = new Set(spendingBudgetProgress.map(item => item.categoryId));
  const noBudgetItems = spendingBreakdown.filter(item => item.categoryId != null && !budgetedCategoryIds.has(item.categoryId));

  const getVisual = (categoryId: number | null) => getCategoryVisual(categoriesById, categoryId);

  if (!hasData) {
    return (
      <View className="items-center py-12">
        <Ionicons name="stats-chart-outline" size={56} color="#d1d5db" />
        <Text className="text-gray-500 text-base mt-3">{t('finance.statistics.noDataMonth')}</Text>
        <Text className="text-gray-400 text-sm mt-1">{t('finance.statistics.noDataHint')}</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-row gap-2 mb-4">
        <KpiCard label={t('finance.statistics.income')} value={mask(formatK(totalIncome))} icon="trending-up-outline" color="#10B981" />
        <KpiCard
          label={t('finance.statistics.expenses')}
          value={mask(formatK(totalSpent))}
          icon="receipt-outline"
          color="#EC4899"
          delta={spentDeltaText}
        />
        <KpiCard label={t('finance.statistics.balance')} value={mask(formatK(balance))} icon="wallet-outline" color="#1987EE" />
        <KpiCard label={t('finance.statistics.saved')} value={mask(formatK(totalSaved))} icon="save-outline" color="#8B5CF6" />
      </View>

      {spendingBreakdown.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-4">{t('finance.statistics.expenseBreakdown')}</Text>
          <View className="gap-2">
            {[...spendingBreakdown]
              .sort((a, b) => b.amount - a.amount)
              .map(item => {
                const visual = getVisual(item.categoryId);
                return (
                  <View key={item.categoryId} className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: visual.color }} />
                    <Text className="text-xs text-gray-600 flex-1">{item.categoryName ?? uncategorizedLabel}</Text>
                    <Text className="text-xs text-gray-500">{Math.round(item.percentage)}%</Text>
                    <Text className="text-xs font-semibold text-gray-700 w-24 text-right">{mask(formatPLN(item.amount))}</Text>
                  </View>
                );
              })}
          </View>
        </View>
      )}

      <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <Text className="text-sm font-bold text-gray-800 mb-4">{t('finance.statistics.budgetVsActual')}</Text>
        <View className="gap-3">
          {spendingBudgetProgress.map(item => {
            const visual = getVisual(item.categoryId);
            const progress = item.limit > 0 ? Math.min(item.spent / item.limit, 1) : 0;
            return (
              <View key={item.budgetId}>
                <View className="flex-row items-center mb-1">
                  <Ionicons name={visual.icon} size={13} color={visual.color} />
                  <Text className="text-xs font-semibold text-gray-700 ml-1.5 flex-1">{item.categoryName ?? uncategorizedLabel}</Text>
                  <Text className="text-xs text-gray-600">{mask(formatPLN(item.spent))}</Text>
                  <Text className="text-xs text-gray-500"> / {mask(formatPLN(item.limit))}</Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${progress * 100}%`, backgroundColor: item.isOverBudget ? '#EF4444' : visual.color }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {noBudgetItems.length > 0 && (
          <>
            <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-3">{t('finance.statistics.noBudgetSet')}</Text>
            <View className="gap-3">
              {noBudgetItems.map(item => {
                const visual = getVisual(item.categoryId);
                const shareOfTotal = Math.min((item.amount / (totalSpent || 1)) * 100, 100);
                return (
                  <View key={item.categoryId}>
                    <View className="flex-row items-center mb-1">
                      <Ionicons name={visual.icon} size={13} color={visual.color} />
                      <Text className="text-xs font-semibold text-gray-700 ml-1.5 flex-1">{item.categoryName ?? uncategorizedLabel}</Text>
                      <Text className="text-xs text-gray-600">{mask(formatPLN(item.amount))}</Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <View className="h-full rounded-full" style={{ width: `${shareOfTotal}%`, backgroundColor: visual.color, opacity: 0.5 }} />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default MonthOverview;
