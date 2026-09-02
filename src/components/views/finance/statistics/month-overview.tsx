import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BudgetProgressRow from './budget-progress-row';
import ExpenseBreakdownRow from './expense-breakdown-row';
import KpiCard from '@/components/shared/kpi-card/kpi-card';
import { IBudgetProgressItem, IFinanceCategory, IMonthlySummary } from '@/contract/finance/finance.contract';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { buildCategoriesById, buildCategoryChartColors, getCategoryVisual, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatK } from '@/utils/finance/format-k';
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

  const chartColorByCategoryId = buildCategoryChartColors(categories);
  const getVisual = (categoryId: number | null) => getCategoryVisual(categoriesById, categoryId);
  // The breakdown bar below is the one place color alone has to tell uncustomized categories apart —
  // everywhere else (icon chips, cards) the name is right next to it, so a shared gray fallback is fine.
  const getChartColor = (categoryId: number | null) =>
    (categoryId != null && categoriesById.get(categoryId)?.color) || chartColorByCategoryId.get(categoryId ?? -1) || getVisual(categoryId).color;

  // Sorted, and each category gets its own bar row (not a pie) — a bar list scales to as many categories
  // as exist and bar length is easy to compare, unlike pie-slice angle/area past a handful of segments.
  const sortedSpendingBreakdown = [...spendingBreakdown].sort((a, b) => b.amount - a.amount);
  const maxSpendingAmount = sortedSpendingBreakdown.length > 0 ? sortedSpendingBreakdown[0].amount : 0;

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

      {sortedSpendingBreakdown.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-4">{t('finance.statistics.expenseBreakdown')}</Text>
          <View className="gap-3">
            {sortedSpendingBreakdown.map(item => {
              const visual = getVisual(item.categoryId);
              return (
                <ExpenseBreakdownRow
                  key={item.categoryId}
                  icon={visual.icon}
                  color={getChartColor(item.categoryId)}
                  label={item.categoryName ?? uncategorizedLabel}
                  amount={item.amount}
                  percentage={item.percentage}
                  barWidthPct={maxSpendingAmount > 0 ? (item.amount / maxSpendingAmount) * 100 : 0}
                  mask={mask}
                />
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
            return (
              <BudgetProgressRow
                key={item.budgetId}
                icon={visual.icon}
                color={visual.color}
                label={item.categoryName ?? uncategorizedLabel}
                spent={item.spent}
                limit={item.limit}
                mask={mask}
              />
            );
          })}
        </View>

        {noBudgetItems.length > 0 && (
          <>
            <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-3">{t('finance.statistics.noBudgetSet')}</Text>
            <View className="gap-3">
              {noBudgetItems.map(item => {
                const visual = getVisual(item.categoryId);
                return (
                  <BudgetProgressRow
                    key={item.categoryId}
                    icon={visual.icon}
                    color={visual.color}
                    label={item.categoryName ?? uncategorizedLabel}
                    spent={item.amount}
                    shareOfTotal={totalSpent > 0 ? item.amount / totalSpent : 0}
                    mask={mask}
                  />
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
