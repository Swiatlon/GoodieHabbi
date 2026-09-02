import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BudgetPlannerRow from '@/components/views/finance/budget-planner/budget-planner-row';
import { useMonthlyHistory } from '@/components/views/finance/budget-planner/use-monthly-history';
import MiniStatCard from '@/components/views/finance/dashboard/mini-stat-card';
import BudgetModal from '@/components/views/finance/expenses/budget-modal';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import { FinanceTransactionTypeEnum, IFinanceCategory } from '@/contract/finance/finance.contract';
import { useFinanceMonth } from '@/providers/finance/finance-month-context';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { useGetBudgetsQuery, useGetFinanceCategoriesQuery } from '@/redux/api/finance/finance-api';
import { collectCategoryIds, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';
import {
  amountForCategoryIds,
  averageDefined,
  BUDGET_HISTORY_MONTHS,
  getBudgetByCategory,
  hasMonthActivity,
  IBudgetSuggestion,
  suggestBudgetAmount,
} from '@/utils/finance/summary-helpers';

const BudgetPlanner = () => {
  const { t } = useTranslation();
  const { year, month, setYear, setMonth } = useFinanceMonth();
  const { mask } = useFinanceDisplay();
  const [budgetCategory, setBudgetCategory] = useState<IFinanceCategory | null>(null);

  const { data: expenseCategories = [], isLoading: loadingCategories } = useGetFinanceCategoriesQuery({
    type: FinanceTransactionTypeEnum.Expense,
  });
  const { data: budgets = [], isLoading: loadingBudgets } = useGetBudgetsQuery({ year, month });
  const history = useMonthlyHistory(year, month);

  const topLevelCategories = useMemo(() => expenseCategories.filter(cat => !cat.parentCategoryId), [expenseCategories]);
  const savingsCategoryIds = useMemo(() => getSavingsCategoryIds(expenseCategories), [expenseCategories]);
  const spendingCategories = topLevelCategories.filter(cat => !savingsCategoryIds.has(cat.id));
  const savingsCategories = topLevelCategories.filter(cat => savingsCategoryIds.has(cat.id));
  const budgetByCategory = useMemo(() => getBudgetByCategory(budgets), [budgets]);

  // Per top-level category (incl. its subcategories): median for a regular category (the typical month —
  // actually hit most months, unlike a mean), or the mean for an irregular one (a sinking-fund amount to set
  // aside so an occasional spike is already covered) — same rule the single-category suggestion in
  // BudgetModal uses, computed here for every category at once from the same fetched monthly summaries.
  const suggestionByCategory = useMemo(() => {
    const map = new Map<number, IBudgetSuggestion>();
    topLevelCategories.forEach(cat => {
      const ids = new Set(collectCategoryIds(cat));
      map.set(cat.id, suggestBudgetAmount(history.map(summary => amountForCategoryIds(summary, ids))));
    });
    return map;
  }, [topLevelCategories, history]);

  // What a category will actually cost you this month if nothing changes: the budget you deliberately set,
  // or — if you haven't set one — the historical suggestion, since that's the realistic number, not zero.
  const effectiveAmount = (category: IFinanceCategory) => {
    const budget = budgetByCategory.get(category.id);
    if (budget && budget.limitAmount > 0) return budget.limitAmount;
    return suggestionByCategory.get(category.id)?.amount ?? 0;
  };

  const needToPrepare = spendingCategories.reduce((sum, cat) => sum + effectiveAmount(cat), 0);
  // Same phantom-zero-month guard as amountForCategoryIds: a month before the account existed reads as a
  // valid all-zero summary too, so it must be excluded here rather than averaged in as "earned nothing".
  const avgIncome = averageDefined(history.map(summary => (hasMonthActivity(summary) ? summary!.totalIncome : undefined)));
  const possibleSavings = avgIncome - needToPrepare;

  const isLoading = loadingCategories || loadingBudgets;
  const currentBudgetForModal = budgetCategory ? (budgetByCategory.get(budgetCategory.id) ?? null) : null;

  return (
    <View className="flex-1 bg-gray-50">
      <YearMonthSelector year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1987EE" />
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text className="text-xs text-gray-500 mb-4">{t('finance.budgetPlanner.subtitle', { months: BUDGET_HISTORY_MONTHS })}</Text>

          <View className="flex-row gap-3 mb-5">
            <MiniStatCard
              icon="wallet-outline"
              color="#1987EE"
              bgClassName="bg-blue-50"
              label={t('finance.budgetPlanner.needToPrepare')}
              value={mask(formatPLN(needToPrepare))}
            />
            <MiniStatCard
              icon={possibleSavings >= 0 ? 'trending-up-outline' : 'alert-circle-outline'}
              color={possibleSavings >= 0 ? '#10B981' : '#EF4444'}
              bgClassName={possibleSavings >= 0 ? 'bg-emerald-50' : 'bg-red-50'}
              label={t('finance.budgetPlanner.canSave')}
              value={mask(formatPLN(Math.max(possibleSavings, 0)))}
              caption={possibleSavings < 0 ? t('finance.budgetPlanner.overspending', { amount: formatPLN(Math.abs(possibleSavings)) }) : undefined}
            />
          </View>

          {spendingCategories.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons name="wallet-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-base mt-3">{t('finance.budgetPlanner.emptyTitle')}</Text>
              <Text className="text-gray-400 text-sm mt-1">{t('finance.budgetPlanner.emptyHint')}</Text>
            </View>
          ) : (
            <>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('finance.budgetPlanner.spendingSection')}</Text>
              {spendingCategories.map(cat => (
                <BudgetPlannerRow
                  key={cat.id}
                  category={cat}
                  budget={budgetByCategory.get(cat.id) ?? null}
                  suggestion={suggestionByCategory.get(cat.id) ?? { amount: 0, isIrregular: false, peak: 0, hasHistory: false }}
                  onPress={() => setBudgetCategory(cat)}
                />
              ))}
            </>
          )}

          {savingsCategories.length > 0 && (
            <>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">{t('finance.budgetPlanner.savingsSection')}</Text>
              {savingsCategories.map(cat => (
                <BudgetPlannerRow
                  key={cat.id}
                  category={cat}
                  budget={budgetByCategory.get(cat.id) ?? null}
                  suggestion={suggestionByCategory.get(cat.id) ?? { amount: 0, isIrregular: false, peak: 0, hasHistory: false }}
                  onPress={() => setBudgetCategory(cat)}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}

      <BudgetModal
        isVisible={budgetCategory !== null}
        onClose={() => setBudgetCategory(null)}
        category={budgetCategory}
        currentBudget={currentBudgetForModal}
        year={year}
        month={month}
      />
    </View>
  );
};

export default BudgetPlanner;
