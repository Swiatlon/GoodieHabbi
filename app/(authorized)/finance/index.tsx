import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import AddTransactionModal from '@/components/views/finance/add-transaction-modal';
import { useMonthlyHistory } from '@/components/views/finance/budget-planner/use-monthly-history';
import MiniStatCard from '@/components/views/finance/dashboard/mini-stat-card';
import MonthlyOverviewCard from '@/components/views/finance/dashboard/monthly-overview-card';
import BudgetModal from '@/components/views/finance/expenses/budget-modal';
import CategoryCard from '@/components/views/finance/expenses/category-card';
import RecurringTransactionsModal from '@/components/views/finance/recurring-transactions-modal';
import HeaderMenu from '@/components/views/finance/shared/header-menu';
import SwipeMonthArea from '@/components/views/finance/shared/swipe-month-area';
import { useFinanceExportPrompt } from '@/components/views/finance/shared/use-finance-export-prompt';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, IFinanceCategory } from '@/contract/finance/finance.contract';
import { useFinanceMonth } from '@/providers/finance/finance-month-context';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import {
  useGetBudgetsQuery,
  useGetFinanceCategoriesQuery,
  useGetMonthlySummaryQuery,
  useGetTransactionsQuery,
} from '@/redux/api/finance/finance-api';
import { buildCategoriesById, collectCategoryIds, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';
import {
  amountForCategoryIds,
  computeBudgetOverview,
  getBudgetByCategory,
  getSavingsAmount,
  groupAmountByCategory,
  groupTransactionsByCategory,
  IBudgetSuggestion,
  suggestBudgetAmount,
} from '@/utils/finance/summary-helpers';

const RECENT_CATEGORIES_LIMIT = 4;
const TRANSACTIONS_PAGE_SIZE = 100;

const topLevelIdForCategoryId = (categories: IFinanceCategory[], categoryId: number) => {
  const direct = categories.find(c => c.id === categoryId);
  if (direct) return direct.id;
  const parent = categories.find(c => (c.subCategories ?? []).some(sub => sub.id === categoryId));
  return parent?.id ?? categoryId;
};

// Most-recently-used top-level category per type, for the "recently used" chips in AddTransactionModal.
const getRecentCategoryIds = (transactions: { type: FinanceTransactionTypeEnum; categoryId: number | null; occurredOn: string }[]) => {
  const forType = (type: FinanceTransactionTypeEnum, categories: IFinanceCategory[]) =>
    [...transactions]
      .filter(tx => tx.type === type && tx.categoryId != null)
      .sort((a, b) => b.occurredOn.localeCompare(a.occurredOn))
      .map(tx => topLevelIdForCategoryId(categories, tx.categoryId!))
      .filter((id, index, all) => all.indexOf(id) === index)
      .slice(0, RECENT_CATEGORIES_LIMIT);
  return forType;
};

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { year, month, setYear, setMonth, goToPreviousMonth, goToNextMonth } = useFinanceMonth();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [recurringModalVisible, setRecurringModalVisible] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState<IFinanceCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Keyed by "year-month" so a dismissal only lasts for the month it was dismissed in — swiping/navigating
  // to a different month (or a future session in a month that still has no budgets) shows the nudge again.
  const [dismissedPlanBannerMonth, setDismissedPlanBannerMonth] = useState<string | null>(null);
  const { hideNumbers, setHideNumbers, mask } = useFinanceDisplay();
  const promptExport = useFinanceExportPrompt();

  const monthStart = dayjs()
    .year(year)
    .month(month - 1)
    .date(1);
  const from = monthStart.startOf('month').format('YYYY-MM-DD');
  const to = monthStart.endOf('month').format('YYYY-MM-DD');

  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useGetMonthlySummaryQuery({ year, month });
  const {
    data: expenseCategories = [],
    isLoading: loadingCategories,
    refetch: refetchCategories,
  } = useGetFinanceCategoriesQuery({ type: FinanceTransactionTypeEnum.Expense });
  const { data: incomeCategories = [], isLoading: loadingIncomeCategories } = useGetFinanceCategoriesQuery({
    type: FinanceTransactionTypeEnum.Income,
  });
  const { data: budgets = [], isLoading: loadingBudgets, refetch: refetchBudgets } = useGetBudgetsQuery({ year, month });
  const {
    data: transactionsPage,
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({ from, to, pageSize: TRANSACTIONS_PAGE_SIZE });
  // Feeds the same median/mean-based suggestion the Budget Planner uses, so a category you haven't
  // deliberately budgeted still shows a realistic budget line here instead of nothing at all.
  const history = useMonthlyHistory(year, month);

  const transactions = transactionsPage?.items ?? [];
  const expenseByCategory = summary?.expenseByCategory ?? [];
  const incomeByCategory = summary?.incomeByCategory ?? [];
  const categoriesById = useMemo(() => buildCategoriesById([...expenseCategories, ...incomeCategories]), [expenseCategories, incomeCategories]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSummary(), refetchCategories(), refetchBudgets(), refetchTransactions()]);
    setRefreshing(false);
  };

  const savingsCategoryIds = useMemo(() => getSavingsCategoryIds(expenseCategories), [expenseCategories]);
  const topLevelExpenseCategories = useMemo(() => expenseCategories.filter(cat => !cat.parentCategoryId), [expenseCategories]);
  const topLevelIncomeCategories = useMemo(() => incomeCategories.filter(cat => !cat.parentCategoryId), [incomeCategories]);
  const spendingCategories = topLevelExpenseCategories.filter(cat => !savingsCategoryIds.has(cat.id));
  const savingsCategories = topLevelExpenseCategories.filter(cat => savingsCategoryIds.has(cat.id));

  // Grouped once per category (instead of re-filtering the full breakdown/transaction list per category on
  // every render) — see docs/finance-backend-todo.md-adjacent perf notes in summary-helpers.ts.
  const expenseAmountByCategory = useMemo(
    () => groupAmountByCategory(expenseByCategory, topLevelExpenseCategories),
    [expenseByCategory, topLevelExpenseCategories]
  );
  const expenseTransactionsByCategory = useMemo(
    () => groupTransactionsByCategory(transactions, FinanceTransactionTypeEnum.Expense, topLevelExpenseCategories),
    [transactions, topLevelExpenseCategories]
  );
  const incomeAmountByCategory = useMemo(
    () => groupAmountByCategory(incomeByCategory, topLevelIncomeCategories),
    [incomeByCategory, topLevelIncomeCategories]
  );
  const incomeTransactionsByCategory = useMemo(
    () => groupTransactionsByCategory(transactions, FinanceTransactionTypeEnum.Income, topLevelIncomeCategories),
    [transactions, topLevelIncomeCategories]
  );
  const budgetByCategory = useMemo(() => getBudgetByCategory(budgets), [budgets]);
  const getBudgetForCategory = (cat: IFinanceCategory) => budgetByCategory.get(cat.id) ?? null;

  // Same rule as the Budget Planner: median for a regular category, mean (sinking-fund amount) for an
  // irregular one — computed once per top-level category from the same fetched monthly summaries.
  const historySuggestionByCategory = useMemo(() => {
    const map = new Map<number, IBudgetSuggestion>();
    topLevelExpenseCategories.forEach(cat => {
      const ids = new Set(collectCategoryIds(cat));
      map.set(cat.id, suggestBudgetAmount(history.map(monthSummary => amountForCategoryIds(monthSummary, ids))));
    });
    return map;
  }, [topLevelExpenseCategories, history]);

  // What actually governs the card: the budget you deliberately set, or — if you haven't — the historical
  // suggestion, flagged as auto so the UI can show it's a proposal, not a commitment, until overridden.
  const getEffectiveBudget = (cat: IFinanceCategory): { amount: number; isAuto: boolean } => {
    const explicit = getBudgetForCategory(cat);
    if (explicit && explicit.limitAmount > 0) return { amount: explicit.limitAmount, isAuto: false };
    return { amount: historySuggestionByCategory.get(cat.id)?.amount ?? 0, isAuto: true };
  };

  const totalIncome = summary?.totalIncome ?? 0;
  // Server-computed, chained across months (see IMonthlySummary.openingBalance) — 0 until the backend ships it.
  const openingBalance = summary?.openingBalance ?? 0;
  const totalSaved = getSavingsAmount(expenseByCategory, savingsCategoryIds);
  // Show the full expense total in the top "Spent" card, including money moved into savings/investments.
  const totalSpent = summary?.totalExpense ?? 0;
  const { totalBudget, totalCommitted, progress, isOver } = computeBudgetOverview(totalIncome, openingBalance, totalSpent);

  // Includes auto-suggested amounts, not just budgets you explicitly set, so this stays consistent with what
  // each category card below is actually showing.
  const sumCategoryBudgets = spendingCategories.reduce((sum, cat) => sum + getEffectiveBudget(cat).amount, 0);
  const allocationDiff = totalBudget - sumCategoryBudgets;
  const savingsBudget = savingsCategories.reduce((sum, cat) => sum + getEffectiveBudget(cat).amount, 0);

  const sortedSpendingCategories = [...spendingCategories].sort(
    (a, b) => (expenseAmountByCategory.get(b.id) ?? 0) - (expenseAmountByCategory.get(a.id) ?? 0)
  );
  const sortedIncomeCategories = [...topLevelIncomeCategories].sort(
    (a, b) => (incomeAmountByCategory.get(b.id) ?? 0) - (incomeAmountByCategory.get(a.id) ?? 0)
  );

  // Only consumed by AddTransactionModal's "recently used" chips, so recomputing it is wasted work on every
  // Dashboard render that isn't about opening that modal — memoized on the data it's actually derived from.
  const recentCategoryIds = useMemo(() => {
    const forType = getRecentCategoryIds(transactions);
    return {
      [FinanceTransactionTypeEnum.Expense]: forType(FinanceTransactionTypeEnum.Expense, expenseCategories),
      [FinanceTransactionTypeEnum.Income]: forType(FinanceTransactionTypeEnum.Income, incomeCategories),
    };
  }, [transactions, expenseCategories, incomeCategories]);

  const currentBudgetForModal = budgetCategory ? getBudgetForCategory(budgetCategory) : null;
  const isLoading = loadingSummary || loadingCategories || loadingIncomeCategories || loadingBudgets || loadingTransactions;

  const monthKey = `${year}-${month}`;
  // No budgets at all this month is exactly the "new month, categories haven't reappeared yet" gap — nudge
  // toward the planner instead of leaving the user to discover it only via the nav bar.
  const showPlanBanner = !loadingBudgets && budgets.length === 0 && dismissedPlanBannerMonth !== monthKey;

  // Privacy toggle sits on the left (used often, needs a fixed spot), the overflow menu on the right —
  // the year stays centered between them instead of both actions crowding one side.
  const leftHeaderActions = (
    <TouchableOpacity
      onPress={() => setHideNumbers(!hideNumbers)}
      className="px-2.5 py-1.5 rounded-lg bg-gray-100"
      accessibilityLabel={t('finance.hideNumbers.toggle')}
    >
      <Text>{hideNumbers ? '🔒' : '👁️'}</Text>
    </TouchableOpacity>
  );

  // Export and recurring are reached far less often than the privacy toggle above, so they're tucked
  // behind one overflow menu instead of sitting as two more always-visible icons next to the date nav.
  const rightHeaderActions = (
    <HeaderMenu
      accessibilityLabel={t('finance.moreActions.toggle')}
      items={[
        {
          icon: 'download-outline',
          label: t('finance.export.title'),
          onPress: () => promptExport(transactions, categoriesById, year, month),
        },
        {
          icon: 'repeat-outline',
          label: t('finance.recurring.action'),
          onPress: () => setRecurringModalVisible(true),
        },
        {
          icon: 'pricetags-outline',
          label: t('finance.categories.manageAction'),
          onPress: () => router.push('/finance/categories'),
        },
      ]}
    />
  );

  return (
    <View className="flex-1 bg-gray-50">
      <YearMonthSelector
        year={year}
        month={month}
        onYearChange={setYear}
        onMonthChange={setMonth}
        leftActions={leftHeaderActions}
        rightActions={rightHeaderActions}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1987EE" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#1987EE']} tintColor="#1987EE" />}
        >
          {showPlanBanner && (
            <View className="bg-blue-50 rounded-2xl p-3.5 mb-4" testID="plan-budget-banner">
              <View className="flex-row items-start gap-3">
                <View className="w-9 h-9 rounded-full bg-white items-center justify-center">
                  <Ionicons name="calendar-outline" size={18} color="#1987EE" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-800">{t('finance.dashboard.planBanner.title')}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{t('finance.dashboard.planBanner.subtitle')}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setDismissedPlanBannerMonth(monthKey)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={t('finance.dashboard.planBanner.dismiss')}
                >
                  <Ionicons name="close" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/finance/budget-planner' as Href)}
                className="mt-3 self-start px-3 py-1.5 rounded-lg bg-primary"
                testID="plan-budget-banner-cta"
              >
                <Text className="text-xs font-bold text-white">{t('finance.dashboard.planBanner.cta')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <SwipeMonthArea onSwipeLeft={goToNextMonth} onSwipeRight={goToPreviousMonth}>
            <MonthlyOverviewCard
              totalSpent={totalSpent}
              totalSaved={totalSaved}
              totalCommitted={totalCommitted}
              totalBudget={totalBudget}
              isOver={isOver}
              progress={progress}
              sumCategoryBudgets={sumCategoryBudgets}
              allocationDiff={allocationDiff}
            />
          </SwipeMonthArea>

          <View className="flex-row gap-3 mb-4">
            {openingBalance > 0 && (
              <MiniStatCard
                icon="wallet-outline"
                color="#1987EE"
                bgClassName="bg-blue-50"
                label={t('finance.dashboard.leftoverFromLastMonth')}
                value={mask(formatPLN(openingBalance))}
              />
            )}
            <MiniStatCard
              icon="trending-up-outline"
              color="#10B981"
              bgClassName="bg-emerald-50"
              label={t('finance.dashboard.savedThisMonth')}
              value={mask(formatPLN(totalSaved))}
              caption={savingsBudget > 0 ? t('finance.dashboard.savingsGoal', { amount: formatPLN(savingsBudget) }) : undefined}
            />
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('finance.dashboard.categories')}</Text>
          {sortedSpendingCategories.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              transactions={expenseTransactionsByCategory.get(cat.id) ?? []}
              actualAmount={expenseAmountByCategory.get(cat.id) ?? 0}
              budgetAmount={getEffectiveBudget(cat).amount}
              isAutoBudget={getEffectiveBudget(cat).isAuto}
              onSetBudget={() => setBudgetCategory(cat)}
              totalForShare={totalSpent}
            />
          ))}

          {savingsCategories.length > 0 && (
            <>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">{t('finance.dashboard.savingsSection')}</Text>
              {savingsCategories.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  transactions={expenseTransactionsByCategory.get(cat.id) ?? []}
                  actualAmount={expenseAmountByCategory.get(cat.id) ?? 0}
                  budgetAmount={getEffectiveBudget(cat).amount}
                  isAutoBudget={getEffectiveBudget(cat).isAuto}
                  onSetBudget={() => setBudgetCategory(cat)}
                  totalForShare={totalSpent}
                />
              ))}
            </>
          )}

          {sortedIncomeCategories.length > 0 && (
            <>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">{t('finance.dashboard.incomeSection')}</Text>
              {sortedIncomeCategories.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  transactions={incomeTransactionsByCategory.get(cat.id) ?? []}
                  actualAmount={incomeAmountByCategory.get(cat.id) ?? 0}
                  budgetAmount={0}
                  showBudget={false}
                  emptyLabel={t('finance.expenses.noIncome')}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => setAddModalVisible(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 6 }}
        accessibilityLabel={t('finance.addTransaction.title')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <AddTransactionModal isVisible={addModalVisible} onClose={() => setAddModalVisible(false)} recentCategoryIds={recentCategoryIds} />
      <RecurringTransactionsModal isVisible={recurringModalVisible} onClose={() => setRecurringModalVisible(false)} categoriesById={categoriesById} />
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

export default Dashboard;
