import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import BudgetProgressRow from './budget-progress-row';
import ExpenseBreakdownRow from './expense-breakdown-row';
import KpiCard from '@/components/shared/kpi-card/kpi-card';
import { IBudgetProgressItem, IFinanceCategory, IYearlySummary } from '@/contract/finance/finance.contract';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { buildCategoriesById, buildCategoryChartColors, getCategoryVisual, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatK } from '@/utils/finance/format-k';
import { getSavingsAmount } from '@/utils/finance/summary-helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;
const AXIS_LABEL_STYLE = { color: '#6b7280', fontSize: 10 };

interface YearOverviewProps {
  year: number;
  summary: IYearlySummary;
  budgetProgress: IBudgetProgressItem[];
  categories: IFinanceCategory[];
  monthsShort: string[];
}

const YearOverview: React.FC<YearOverviewProps> = ({ year, summary, budgetProgress, categories, monthsShort }) => {
  const { t } = useTranslation();
  const { mask } = useFinanceDisplay();
  const uncategorizedLabel = t('finance.history.uncategorized');

  const categoriesById = buildCategoriesById(categories);
  const savingsCategoryIds = getSavingsCategoryIds(categories);
  const chartColorByCategoryId = buildCategoryChartColors(categories);

  const getVisual = (categoryId: number | null) => getCategoryVisual(categoriesById, categoryId);
  // The pie/donut and its legend are the one place color alone has to tell categories apart — everywhere
  // else (icon chips, cards) the name is right next to it, so a shared gray fallback there is fine.
  const getChartColor = (categoryId: number | null) =>
    (categoryId != null && categoriesById.get(categoryId)?.color) || chartColorByCategoryId.get(categoryId ?? -1) || getVisual(categoryId).color;

  const hasAnyData = summary.totalExpense > 0 || summary.totalIncome > 0;

  if (!hasAnyData) {
    return (
      <View className="items-center py-12">
        <Ionicons name="stats-chart-outline" size={56} color="#d1d5db" />
        <Text className="text-gray-500 text-base mt-3">{t('finance.statistics.noData', { year })}</Text>
        <Text className="text-gray-400 text-sm mt-1">{t('finance.statistics.noDataHint')}</Text>
      </View>
    );
  }

  const totalSpent = summary.totalExpense;
  const yearBalance = summary.totalIncome - totalSpent;
  // Actual money moved into savings/investment categories — was previously mislabeled as "Oszczędności"
  // while showing the overall balance percentage instead, which duplicated the "Saldo" card.
  const totalSaved = getSavingsAmount(summary.expenseByCategory, savingsCategoryIds);

  const spendingBreakdown = summary.expenseByCategory.filter(item => item.categoryId != null && !savingsCategoryIds.has(item.categoryId));

  const barData = summary.months.flatMap((m, i) => [
    {
      value: m.totalIncome,
      label: monthsShort[i],
      frontColor: '#10B981',
      spacing: 2,
      labelTextStyle: AXIS_LABEL_STYLE,
      topLabelComponent: () =>
        m.totalIncome > 0 ? <Text style={{ color: '#10B981', fontSize: 9, marginBottom: 2 }}>{mask(formatK(m.totalIncome))}</Text> : null,
    },
    {
      value: m.totalExpense,
      frontColor: '#EC4899',
      spacing: 8,
      topLabelComponent: () =>
        m.totalExpense > 0 ? <Text style={{ color: '#EC4899', fontSize: 9, marginBottom: 2 }}>{mask(formatK(m.totalExpense))}</Text> : null,
    },
  ]);

  // Sorted, not folded — a horizontal bar list scales to as many categories as exist (each gets its own
  // row), unlike a pie/donut which can't tell more than ~7 slices apart by angle or color. Bar length
  // relative to the biggest category is also something people can actually compare at a glance; pie-slice
  // angle or area is not.
  const sortedSpendingBreakdown = [...spendingBreakdown].sort((a, b) => b.amount - a.amount);
  const maxSpendingAmount = sortedSpendingBreakdown.length > 0 ? sortedSpendingBreakdown[0].amount : 0;

  const hasNegative = summary.months.some(m => m.net < 0);
  const lineData = summary.months.map(m => ({
    value: Math.max(m.net, 0),
    dataPointText: m.net > 0 ? mask(formatK(m.net)) : '',
  }));

  const spendingBudgetProgress = budgetProgress.filter(item => item.categoryId != null && !savingsCategoryIds.has(item.categoryId));
  const budgetedCategoryIds = new Set(spendingBudgetProgress.map(item => item.categoryId));
  const noBudgetItems = spendingBreakdown.filter(item => item.categoryId != null && !budgetedCategoryIds.has(item.categoryId));

  return (
    <>
      <View className="flex-row gap-2 mb-4">
        <KpiCard label={t('finance.statistics.income')} value={mask(formatK(summary.totalIncome))} icon="trending-up-outline" color="#10B981" />
        <KpiCard label={t('finance.statistics.expenses')} value={mask(formatK(totalSpent))} icon="receipt-outline" color="#EC4899" />
        <KpiCard label={t('finance.statistics.balance')} value={mask(formatK(yearBalance))} icon="wallet-outline" color="#1987EE" />
        <KpiCard label={t('finance.statistics.saved')} value={mask(formatK(totalSaved))} icon="save-outline" color="#8B5CF6" />
      </View>

      {sortedSpendingBreakdown.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-gray-800">{t('finance.statistics.expenseBreakdown')}</Text>
            <Text className="text-xs text-gray-400">
              {t('finance.statistics.total')}: {mask(formatK(totalSpent))}
            </Text>
          </View>
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

      {barData.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-1">{t('finance.statistics.monthlyOverview')}</Text>
          <View className="flex-row gap-3 mb-4">
            <View className="flex-row items-center gap-1">
              <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10B981' }} />
              <Text className="text-xs text-gray-600">{t('finance.statistics.incomeLabel')}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#EC4899' }} />
              <Text className="text-xs text-gray-600">{t('finance.statistics.expensesLabel')}</Text>
            </View>
          </View>
          <BarChart
            data={barData}
            barWidth={6}
            barBorderRadius={2}
            noOfSections={4}
            yAxisTextStyle={AXIS_LABEL_STYLE}
            xAxisLabelTextStyle={AXIS_LABEL_STYLE}
            yAxisLabelPrefix=""
            formatYLabel={v => mask(formatK(Number(v)))}
            hideRules
            disableScroll
            width={CHART_WIDTH - 32}
            height={160}
            isAnimated
          />
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

      {lineData.some(d => d.value !== 0) && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-1">{t('finance.statistics.balanceTrend')}</Text>
          <Text className="text-xs text-gray-500 mb-4">
            {hasNegative ? t('finance.statistics.negativeMonths') : t('finance.statistics.monthlyBalance')}
          </Text>
          <LineChart
            data={lineData}
            width={CHART_WIDTH - 48}
            height={120}
            curved
            color="#1987EE"
            thickness={2.5}
            dataPointsColor="#1987EE"
            dataPointsRadius={4}
            startFillColor="#1987EE"
            endFillColor="white"
            startOpacity={0.3}
            endOpacity={0.01}
            areaChart
            noOfSections={3}
            yAxisTextStyle={AXIS_LABEL_STYLE}
            formatYLabel={v => mask(formatK(Number(v)))}
            xAxisLabelTexts={monthsShort}
            xAxisLabelTextStyle={AXIS_LABEL_STYLE}
            hideRules
            isAnimated
            textShiftY={-8}
            textFontSize={10}
            textColor="#4b5563"
          />
        </View>
      )}
    </>
  );
};

export default YearOverview;
