import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import KpiCard from './kpi-card';
import { IBudgetProgressItem, IFinanceCategory, IYearlySummary } from '@/contract/finance/finance.contract';
import { buildCategoriesById, getCategoryVisual, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatK } from '@/utils/finance/format-k';
import { formatPLN } from '@/utils/finance/format-pln';

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
  const uncategorizedLabel = t('finance.history.uncategorized');

  const categoriesById = buildCategoriesById(categories);
  const savingsCategoryIds = getSavingsCategoryIds(categories);

  const getVisual = (categoryId: number | null) => getCategoryVisual(categoriesById, categoryId);

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

  const totalSaved = summary.expenseByCategory
    .filter(item => item.categoryId != null && savingsCategoryIds.has(item.categoryId))
    .reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = summary.totalExpense - totalSaved;
  const yearBalance = summary.totalIncome - totalSpent;
  const savingsPercent = summary.totalIncome > 0 ? Math.round(((summary.totalIncome - totalSpent) / summary.totalIncome) * 100) : 0;

  const spendingBreakdown = summary.expenseByCategory.filter(item => item.categoryId != null && !savingsCategoryIds.has(item.categoryId));

  const barData = summary.months.flatMap((m, i) => [
    {
      value: m.totalIncome,
      label: monthsShort[i],
      frontColor: '#1987EE',
      spacing: 2,
      labelTextStyle: AXIS_LABEL_STYLE,
      topLabelComponent: () =>
        m.totalIncome > 0 ? <Text style={{ color: '#1987EE', fontSize: 9, marginBottom: 2 }}>{formatK(m.totalIncome)}</Text> : null,
    },
    {
      value: m.totalExpense,
      frontColor: '#EC4899',
      spacing: 8,
      topLabelComponent: () =>
        m.totalExpense > 0 ? <Text style={{ color: '#EC4899', fontSize: 9, marginBottom: 2 }}>{formatK(m.totalExpense)}</Text> : null,
    },
  ]);

  const pieData = spendingBreakdown.map(item => ({ value: item.amount, color: getVisual(item.categoryId).color }));

  const hasNegative = summary.months.some(m => m.net < 0);
  const lineData = summary.months.map(m => ({
    value: Math.max(m.net, 0),
    dataPointText: m.net > 0 ? formatK(m.net) : '',
  }));

  const spendingBudgetProgress = budgetProgress.filter(item => item.categoryId != null && !savingsCategoryIds.has(item.categoryId));
  const budgetedCategoryIds = new Set(spendingBudgetProgress.map(item => item.categoryId));
  const noBudgetItems = spendingBreakdown.filter(item => item.categoryId != null && !budgetedCategoryIds.has(item.categoryId));

  const sortedSpendingBreakdown = [...spendingBreakdown].sort((a, b) => b.amount - a.amount);
  const biggestCategory = sortedSpendingBreakdown.length > 0 ? sortedSpendingBreakdown[0] : null;

  return (
    <>
      <View className="flex-row gap-2 mb-4">
        <KpiCard label={t('finance.statistics.income')} value={formatK(summary.totalIncome)} icon="trending-up-outline" color="#10B981" />
        <KpiCard label={t('finance.statistics.expenses')} value={formatK(totalSpent)} icon="receipt-outline" color="#EC4899" />
        <KpiCard label={t('finance.statistics.balance')} value={formatK(yearBalance)} icon="wallet-outline" color="#1987EE" />
        <KpiCard label={t('finance.statistics.savings')} value={`${savingsPercent}%`} icon="save-outline" color="#8B5CF6" />
      </View>

      {pieData.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-4">{t('finance.statistics.expenseBreakdown')}</Text>
          <View className="items-center mb-4">
            <PieChart
              data={pieData}
              donut
              radius={80}
              innerRadius={52}
              innerCircleColor="white"
              centerLabelComponent={() => (
                <View className="items-center">
                  <Text className="text-xs text-gray-500">{t('finance.statistics.total')}</Text>
                  <Text className="text-sm font-bold text-gray-800">{formatK(totalSpent)}</Text>
                </View>
              )}
            />
          </View>
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
                    <Text className="text-xs font-semibold text-gray-700 w-24 text-right">{formatPLN(item.amount)}</Text>
                  </View>
                );
              })}
          </View>
          {biggestCategory && (
            <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              <Ionicons name={getVisual(biggestCategory.categoryId).icon} size={13} color={getVisual(biggestCategory.categoryId).color} />
              <Text className="text-xs text-gray-500 flex-1">{t('finance.statistics.biggestCategory')}</Text>
              <Text className="text-xs font-bold text-gray-700">{biggestCategory.categoryName ?? uncategorizedLabel}</Text>
            </View>
          )}
        </View>
      )}

      {barData.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-1">{t('finance.statistics.monthlyOverview')}</Text>
          <View className="flex-row gap-3 mb-4">
            <View className="flex-row items-center gap-1">
              <View className="w-3 h-3 rounded-sm bg-primary" />
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
            formatYLabel={v => formatK(Number(v))}
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
            const progress = item.limit > 0 ? Math.min(item.spent / item.limit, 1) : 0;
            return (
              <View key={item.budgetId}>
                <View className="flex-row items-center mb-1">
                  <Ionicons name={visual.icon} size={13} color={visual.color} />
                  <Text className="text-xs font-semibold text-gray-700 ml-1.5 flex-1">{item.categoryName ?? uncategorizedLabel}</Text>
                  <Text className="text-xs text-gray-600">{formatPLN(item.spent)}</Text>
                  <Text className="text-xs text-gray-500"> / {formatPLN(item.limit)}</Text>
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
                      <Text className="text-xs text-gray-600">{formatPLN(item.amount)}</Text>
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
            formatYLabel={v => formatK(Number(v))}
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
