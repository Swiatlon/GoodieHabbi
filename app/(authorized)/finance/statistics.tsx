import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import { useFinanceBreakdownExportPrompt } from '@/components/views/finance/shared/use-finance-breakdown-export-prompt';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import YearSelector from '@/components/views/finance/shared/year-selector';
import MonthOverview from '@/components/views/finance/statistics/month-overview';
import YearOverview from '@/components/views/finance/statistics/year-overview';
import { FinanceTransactionTypeEnum } from '@/contract/finance/finance.contract';
import { useFinanceMonth } from '@/providers/finance/finance-month-context';
import {
  useGetBudgetProgressQuery,
  useGetFinanceCategoriesQuery,
  useGetMonthlySummaryQuery,
  useGetYearlySummaryQuery,
} from '@/redux/api/finance/finance-api';
import { buildCategoriesById } from '@/utils/finance/category-helpers';
import { MONTH_KEYS } from '@/utils/finance/month-keys';

type ViewMode = 'month' | 'year';

const Statistics = () => {
  const { t } = useTranslation();
  const { year, month, setYear, setMonth } = useFinanceMonth();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [refreshing, setRefreshing] = useState(false);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const { data: categories = [], isLoading: loadingCategories } = useGetFinanceCategoriesQuery({ type: FinanceTransactionTypeEnum.Expense });
  const { data: incomeCategories = [] } = useGetFinanceCategoriesQuery({ type: FinanceTransactionTypeEnum.Income });
  const categoriesById = useMemo(() => buildCategoriesById([...categories, ...incomeCategories]), [categories, incomeCategories]);
  const promptExport = useFinanceBreakdownExportPrompt();

  const { data: monthSummary, isLoading: loadingMonthSummary, refetch: refetchMonthSummary } = useGetMonthlySummaryQuery({ year, month });
  const { data: prevMonthSummary } = useGetMonthlySummaryQuery({ year: prevYear, month: prevMonth });
  const {
    data: monthBudgetProgress = [],
    isLoading: loadingMonthBudgetProgress,
    refetch: refetchMonthBudgetProgress,
  } = useGetBudgetProgressQuery({ year, month });

  const { data: yearSummary, isLoading: loadingYearSummary, refetch: refetchYearSummary } = useGetYearlySummaryQuery({ year });
  const {
    data: yearBudgetProgress = [],
    isLoading: loadingYearBudgetProgress,
    refetch: refetchYearBudgetProgress,
  } = useGetBudgetProgressQuery({ year });

  const isLoading =
    loadingCategories ||
    (viewMode === 'year'
      ? loadingYearSummary || loadingYearBudgetProgress || !yearSummary
      : loadingMonthSummary || loadingMonthBudgetProgress || !monthSummary);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (viewMode === 'year') {
      await Promise.all([refetchYearSummary(), refetchYearBudgetProgress()]);
    } else {
      await Promise.all([refetchMonthSummary(), refetchMonthBudgetProgress()]);
    }
    setRefreshing(false);
  };

  const monthsShort = MONTH_KEYS.map(key => t(`finance.months.${key}`));

  return (
    <View className="flex-1 bg-gray-50">
      {viewMode === 'month' ? (
        <YearMonthSelector year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />
      ) : (
        <YearSelector year={year} onYearChange={setYear} />
      )}

      <View className="flex-row items-center gap-2 bg-white px-4 pb-3">
        <View className="flex-1 flex-row bg-gray-100 rounded-xl p-1">
          <ToggleTab active={viewMode === 'month'} onPress={() => setViewMode('month')}>
            <Text className={`text-xs font-bold ${viewMode === 'month' ? 'text-primary' : 'text-gray-500'}`}>
              {t('finance.statistics.viewMonth')}
            </Text>
          </ToggleTab>
          <ToggleTab active={viewMode === 'year'} onPress={() => setViewMode('year')}>
            <Text className={`text-xs font-bold ${viewMode === 'year' ? 'text-primary' : 'text-gray-500'}`}>{t('finance.statistics.viewYear')}</Text>
          </ToggleTab>
        </View>
        <TouchableOpacity
          onPress={() => {
            const summary = viewMode === 'year' ? yearSummary : monthSummary;
            if (!summary) return;
            promptExport(summary.incomeByCategory, summary.expenseByCategory, categoriesById, year, viewMode === 'year' ? null : month);
          }}
          disabled={viewMode === 'year' ? !yearSummary : !monthSummary}
          className="w-10 h-10 items-center justify-center bg-gray-100 rounded-xl"
          accessibilityLabel={t('finance.export.title')}
        >
          <Ionicons name="download-outline" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1987EE" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#1987EE']} tintColor="#1987EE" />}
        >
          {viewMode === 'month'
            ? monthSummary && (
                <MonthOverview
                  summary={monthSummary}
                  prevSummary={prevMonthSummary ?? null}
                  budgetProgress={monthBudgetProgress}
                  categories={categories}
                />
              )
            : yearSummary && (
                <YearOverview
                  year={year}
                  summary={yearSummary}
                  budgetProgress={yearBudgetProgress}
                  categories={categories}
                  monthsShort={monthsShort}
                />
              )}
        </ScrollView>
      )}
    </View>
  );
};

export default Statistics;
