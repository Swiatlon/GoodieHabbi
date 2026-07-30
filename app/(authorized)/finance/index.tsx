import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AddTransactionModal from '@/components/views/finance/add-transaction-modal';
import MonthlyOverviewCard from '@/components/views/finance/dashboard/monthly-overview-card';
import BudgetModal from '@/components/views/finance/expenses/budget-modal';
import CategoryCard from '@/components/views/finance/expenses/category-card';
import SwipeMonthArea from '@/components/views/finance/shared/swipe-month-area';
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
import { collectCategoryIds, getSavingsCategoryIds } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

const RECENT_CATEGORIES_LIMIT = 4;
const TRANSACTIONS_PAGE_SIZE = 100;

const Dashboard = () => {
  const { t } = useTranslation();
  const { year, month, setYear, setMonth, goToPreviousMonth, goToNextMonth } = useFinanceMonth();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState<IFinanceCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const transactions = transactionsPage?.items ?? [];
  const expenseByCategory = summary?.expenseByCategory ?? [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSummary(), refetchCategories(), refetchBudgets(), refetchTransactions()]);
    setRefreshing(false);
  };

  const savingsCategoryIds = getSavingsCategoryIds(expenseCategories);
  const topLevelExpenseCategories = expenseCategories.filter(cat => !cat.parentCategoryId);
  const spendingCategories = topLevelExpenseCategories.filter(cat => !savingsCategoryIds.has(cat.id));
  const savingsCategories = topLevelExpenseCategories.filter(cat => savingsCategoryIds.has(cat.id));

  const totalIncome = summary?.totalIncome ?? 0;
  const totalSaved = expenseByCategory
    .filter(item => item.categoryId != null && savingsCategoryIds.has(item.categoryId))
    .reduce((sum, item) => sum + item.amount, 0);
  // Show the full expense total in the top "Spent" card, including money moved into savings/investments.
  const totalSpent = summary?.totalExpense ?? 0;
  const totalCommitted = totalSpent;
  const totalBudget = totalIncome;
  const progress = totalBudget > 0 ? Math.min(totalCommitted / totalBudget, 1) : 0;
  const isOver = totalBudget > 0 && totalCommitted > totalBudget;

  const spendingBudgets = budgets.filter(b => b.categoryId != null && !savingsCategoryIds.has(b.categoryId));
  const sumCategoryBudgets = spendingBudgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const allocationDiff = totalBudget - sumCategoryBudgets;
  const savingsBudget = budgets.filter(b => b.categoryId != null && savingsCategoryIds.has(b.categoryId)).reduce((sum, b) => sum + b.limitAmount, 0);

  const getBudgetForCategory = (cat: IFinanceCategory) => budgets.find(b => b.categoryId === cat.id) ?? null;
  const getActualForCategory = (cat: IFinanceCategory) => {
    const ids = new Set(collectCategoryIds(cat));
    return expenseByCategory.filter(item => item.categoryId != null && ids.has(item.categoryId)).reduce((sum, item) => sum + item.amount, 0);
  };
  const getTransactionsForCategory = (cat: IFinanceCategory) => {
    const ids = new Set(collectCategoryIds(cat));
    return transactions.filter(tx => tx.type === FinanceTransactionTypeEnum.Expense && tx.categoryId != null && ids.has(tx.categoryId));
  };

  const sortedSpendingCategories = [...spendingCategories].sort((a, b) => getActualForCategory(b) - getActualForCategory(a));

  const topLevelIdForCategoryId = (categories: IFinanceCategory[], categoryId: number) => {
    const direct = categories.find(c => c.id === categoryId);
    if (direct) return direct.id;
    const parent = categories.find(c => (c.subCategories ?? []).some(sub => sub.id === categoryId));
    return parent?.id ?? categoryId;
  };

  const getRecentCategoryIds = (type: FinanceTransactionTypeEnum, categories: IFinanceCategory[]) =>
    [...transactions]
      .filter(tx => tx.type === type && tx.categoryId != null)
      .sort((a, b) => b.occurredOn.localeCompare(a.occurredOn))
      .map(tx => topLevelIdForCategoryId(categories, tx.categoryId!))
      .filter((id, index, all) => all.indexOf(id) === index)
      .slice(0, RECENT_CATEGORIES_LIMIT);

  const recentCategoryIds = {
    [FinanceTransactionTypeEnum.Expense]: getRecentCategoryIds(FinanceTransactionTypeEnum.Expense, expenseCategories),
    [FinanceTransactionTypeEnum.Income]: getRecentCategoryIds(FinanceTransactionTypeEnum.Income, incomeCategories),
  };

  const currentBudgetForModal = budgetCategory ? getBudgetForCategory(budgetCategory) : null;
  const isLoading = loadingSummary || loadingCategories || loadingIncomeCategories || loadingBudgets || loadingTransactions;

  const { hideNumbers, setHideNumbers } = useFinanceDisplay();

  return (
    <View className="flex-1 bg-gray-50">
      <YearMonthSelector year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />

      <View className="absolute top-4 right-4 flex-row items-center gap-2">
        <TouchableOpacity onPress={() => setHideNumbers(!hideNumbers)} className="px-3 py-2 rounded-lg bg-gray-100">
          <Text>{hideNumbers ? '🔒' : '👁️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const catMap = new Map<number, string>();
            [...expenseCategories, ...incomeCategories].forEach(c => catMap.set(c.id, c.name));
            const rows = transactions.map(tx => ({
              id: tx.id,
              type: tx.type,
              date: tx.occurredOn,
              category: tx.categoryId ? (catMap.get(tx.categoryId) ?? tx.categoryId) : '',
              amount: tx.netAmount,
              note: tx.note ?? '',
            }));

            const payload = { exportedAt: new Date().toISOString(), year, month, items: rows };
            const json = JSON.stringify(payload, null, 2);
            try {
              const filename = `goodiehabbi-export-${year}-${String(month).padStart(2, '0')}.json`;
              const path = FileSystem.cacheDirectory + filename;
              await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Export JSON' });
              } else {
                await Share.share({ title: 'Finance export', message: json });
              }
            } catch (e) {
              // ignore
            }
          }}
          className="px-3 py-2 rounded-lg bg-gray-100"
        >
          <Text>⬇️</Text>
        </TouchableOpacity>
      </View>

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

          <View className="bg-emerald-50 rounded-2xl p-4 mb-4 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-emerald-100">
              <Ionicons name="trending-up-outline" size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{t('finance.dashboard.savedThisMonth')}</Text>
              <Text className="text-lg font-bold text-emerald-700">{formatPLN(totalSaved)}</Text>
            </View>
            {savingsBudget > 0 && (
              <Text className="text-xs text-emerald-600">{t('finance.dashboard.savingsGoal', { amount: formatPLN(savingsBudget) })}</Text>
            )}
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('finance.dashboard.categories')}</Text>
          {sortedSpendingCategories.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              transactions={getTransactionsForCategory(cat)}
              actualAmount={getActualForCategory(cat)}
              budgetAmount={getBudgetForCategory(cat)?.limitAmount ?? 0}
              onSetBudget={() => setBudgetCategory(cat)}
            />
          ))}

          {savingsCategories.length > 0 && (
            <>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">{t('finance.dashboard.savingsSection')}</Text>
              {savingsCategories.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  transactions={getTransactionsForCategory(cat)}
                  actualAmount={getActualForCategory(cat)}
                  budgetAmount={getBudgetForCategory(cat)?.limitAmount ?? 0}
                  onSetBudget={() => setBudgetCategory(cat)}
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
