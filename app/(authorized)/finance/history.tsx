import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '@/components/shared/search-bar/search-bar';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import AddCorrectionModal from '@/components/views/finance/add-correction-modal';
import AddTransactionModal from '@/components/views/finance/add-transaction-modal';
import CopyFromLastMonthModal from '@/components/views/finance/copy-from-last-month-modal';
import CopyTransactionModal from '@/components/views/finance/copy-transaction-modal';
import HistoryFiltersModal from '@/components/views/finance/history-filters-modal';
import CorrectionSummary from '@/components/views/finance/shared/correction-summary';
import UnpaidBadge from '@/components/views/finance/shared/unpaid-badge';
import { useFinanceExportPrompt } from '@/components/views/finance/shared/use-finance-export-prompt';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import { FinanceTransactionTypeEnum, ITransaction, ITransactionPagedResult } from '@/contract/finance/finance.contract';
import useDebouncedValue from '@/hooks/use-debounced-value';
import { useFinanceMonth } from '@/providers/finance/finance-month-context';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import {
  useDeleteTransactionMutation,
  useGetFinanceCategoriesQuery,
  useGetMonthlySummaryQuery,
  useGetTransactionsQuery,
} from '@/redux/api/finance/finance-api';
import { buildCategoriesById, getCategoryLabel, getTransactionVisual } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';
import {
  buildTransactionQuery,
  countActiveFilters,
  DEFAULT_HISTORY_FILTERS,
  HISTORY_PAGE_SIZE,
  IHistoryFilters,
  isBrowsingMonth,
  SEARCH_MAX_LENGTH,
} from '@/utils/finance/history-filters';

// A render error here would otherwise unwind into the finance <Slot /> and surface as a misleading
// "Couldn't find a navigation context"; this keeps the real message on screen.
export { ErrorBoundary } from 'expo-router';

type TypeFilter = 'all' | FinanceTransactionTypeEnum;

const SEARCH_DEBOUNCE_MS = 300;
const DELETE_LABEL_KEY = 'common.delete';
const ICON_BUTTON_CLASS = 'w-10 h-10 items-center justify-center bg-white border rounded-xl';

const History = () => {
  const { t } = useTranslation();
  // Year/month stay shared with the other finance screens (the add modal defaults its date from them);
  // the range mode is History-only and never written back, so widening it can't move the Dashboard's month.
  const { year, month, setYear, setMonth } = useFinanceMonth();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [correctingTransaction, setCorrectingTransaction] = useState<ITransaction | null>(null);
  const [copyingTransaction, setCopyingTransaction] = useState<ITransaction | null>(null);
  const [copyLastMonthVisible, setCopyLastMonthVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedCorrectionsId, setExpandedCorrectionsId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<IHistoryFilters>(DEFAULT_HISTORY_FILTERS);
  const { mask } = useFinanceDisplay();
  const promptExport = useFinanceExportPrompt();

  // Every distinct query arg is its own request and cache entry, so keystrokes are settled before they become one.
  const search = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const queryFilters = useMemo(() => buildTransactionQuery(filters, search, year, month), [filters, search, year, month]);
  const querySignature = JSON.stringify(queryFilters);

  // The page is tied to the filters it was loaded for, so any change to them lands back on page 1 in the same
  // render — no request ever goes out for page N of a result set the user hasn't seen page 1 of.
  const [paging, setPaging] = useState({ signature: querySignature, page: 1 });
  const page = paging.signature === querySignature ? paging.page : 1;
  // Pages loaded earlier are no longer subscribed, so after any write they'd show stale rows: start over from page 1.
  const resetPaging = () => setPaging({ signature: querySignature, page: 1 });

  const {
    // `data`, not `currentData`: it keeps the previous result while the next one loads, so the list doesn't blank per keystroke.
    data: transactionsPage,
    isFetching,
    isError,
    refetch,
  } = useGetTransactionsQuery({ ...queryFilters, page, pageSize: HISTORY_PAGE_SIZE }, { refetchOnMountOrArgChange: true });
  const { data: expenseCategories = [], isLoading: loadingExpenseCategories } = useGetFinanceCategoriesQuery({
    type: FinanceTransactionTypeEnum.Expense,
  });
  const { data: incomeCategories = [], isLoading: loadingIncomeCategories } = useGetFinanceCategoriesQuery({
    type: FinanceTransactionTypeEnum.Income,
  });
  // Totals come from the server, not from the rows: with `type` as a server filter, summing loaded rows would read
  // "income: 0" whenever the Expenses tab is on, and would under-count any month longer than one page.
  const { data: monthlySummary } = useGetMonthlySummaryQuery({ year, month }, { skip: filters.rangeMode !== 'month' });
  const [deleteTransaction] = useDeleteTransactionMutation();

  // Accumulated during render rather than in an effect, so there's never a frame where `totalCount` has arrived
  // but the rows haven't. The arriving page replaces its own slice, so a refetch repaints instead of duplicating.
  const [syncedPage, setSyncedPage] = useState<ITransactionPagedResult | undefined>(undefined);
  const [loadedItems, setLoadedItems] = useState<ITransaction[]>([]);
  if (transactionsPage && transactionsPage !== syncedPage) {
    setSyncedPage(transactionsPage);
    setLoadedItems(prev => [...prev.slice(0, (transactionsPage.page - 1) * HISTORY_PAGE_SIZE), ...transactionsPage.items]);
  }

  const categoriesById = useMemo(() => buildCategoriesById([...expenseCategories, ...incomeCategories]), [expenseCategories, incomeCategories]);

  const isMonthMode = filters.rangeMode === 'month';
  const isPlainMonth = isBrowsingMonth(filters, search);
  const activeFilterCount = countActiveFilters(filters);
  const totalCount = transactionsPage?.totalCount ?? 0;
  const isInitialLoading = loadingExpenseCategories || loadingIncomeCategories || (!transactionsPage && isFetching);
  // While a page is in flight the loaded rows may still belong to the previous filters, so loading more is held back.
  const hasMore = !isFetching && loadedItems.length < totalCount;

  const typeFilter: TypeFilter = filters.type ?? 'all';

  const handleRefresh = async () => {
    setRefreshing(true);
    if (page === 1) {
      await refetch();
    } else {
      resetPaging();
    }
    setRefreshing(false);
  };

  const handleLoadMore = () => setPaging({ signature: querySignature, page: page + 1 });

  // Tapping a month is always a request to see that month, so it also narrows a wider range back down.
  const handleMonthChange = (nextMonth: number) => {
    setMonth(nextMonth);
    setFilters(prev => (prev.rangeMode === 'month' ? prev : { ...prev, rangeMode: 'month' }));
  };

  const handleTypeChange = (next: TypeFilter) => setFilters(prev => ({ ...prev, type: next === 'all' ? null : next }));

  const handleClearAll = () => {
    setFilters(DEFAULT_HISTORY_FILTERS);
    setSearchInput('');
  };

  const handleSearchAllTime = () => setFilters(prev => ({ ...prev, rangeMode: 'all' }));

  const handleExport = () => {
    const periodLabel = isMonthMode ? undefined : `${queryFilters.from ?? 'start'}_${queryFilters.to ?? 'now'}`;
    promptExport(loadedItems, categoriesById, year, month, periodLabel);
  };

  // Every write modal resets paging on close, whether or not it wrote — the modals don't report which.
  const closeWith = (close: () => void) => () => {
    close();
    resetPaging();
  };

  const getLabel = (transaction: ITransaction) => getCategoryLabel(categoriesById, transaction.categoryId, t('finance.history.uncategorized'));

  const getMeta = (transaction: ITransaction) => getTransactionVisual(categoriesById, transaction);

  const handleDelete = (transaction: ITransaction) => {
    const isCorrection = transaction.correctsTransactionId != null;
    Alert.alert(
      t(isCorrection ? 'finance.corrections.deleteTitle' : 'finance.history.deleteTitle'),
      t(isCorrection ? 'finance.corrections.deleteMessage' : 'finance.history.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t(DELETE_LABEL_KEY),
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction({ id: transaction.id });
            resetPaging();
          },
        },
      ]
    );
  };

  const formatTotal = (value: number | undefined) => (value == null ? '—' : mask(formatPLN(value)));

  const renderEmptyState = () => {
    if (isError) {
      return (
        <View className="items-center py-12">
          <Ionicons name="cloud-offline-outline" size={48} color="#d1d5db" />
          <Text className="text-gray-500 text-base mt-3">{t('common.dataLoadError')}</Text>
          <TouchableOpacity onPress={() => refetch()} className="mt-4 border border-primary rounded-lg px-4 py-2">
            <Text className="text-primary font-semibold">{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isPlainMonth) {
      return (
        <View className="items-center py-12">
          <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
          <Text className="text-gray-500 text-base mt-3">{t('finance.history.emptyTitle')}</Text>
          <Text className="text-gray-400 text-sm mt-1">{t('finance.history.emptyHint')}</Text>
        </View>
      );
    }

    return (
      <View className="items-center py-12">
        <Ionicons name="search-outline" size={48} color="#d1d5db" />
        <Text className="text-gray-500 text-base mt-3">{t('finance.history.noResults')}</Text>
        {filters.rangeMode !== 'all' && (
          <TouchableOpacity onPress={handleSearchAllTime} className="mt-4 border border-primary rounded-lg px-4 py-2">
            <Text className="text-primary font-semibold">{t('finance.history.searchAllTime')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderTransactionRow = (transaction: ITransaction, idx: number) => {
    const meta = getMeta(transaction);
    const isExpense = transaction.type === FinanceTransactionTypeEnum.Expense;
    const isExpanded = expandedCorrectionsId === transaction.id;
    const isFullyReturned = transaction.correctedAmount >= transaction.amount;

    return (
      <View key={transaction.id} className={idx < loadedItems.length - 1 ? 'border-b border-gray-50' : ''}>
        <TouchableOpacity onPress={() => setEditingTransaction(transaction)} activeOpacity={0.7} className="flex-row items-center px-4 py-3 bg-white">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${meta.color}20` }}>
            <Ionicons name={meta.icon} size={18} color={meta.color} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
              {getLabel(transaction)}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs text-gray-500">{transaction.occurredOn}</Text>
              {transaction.note ? (
                <Text className="text-xs text-gray-500 italic" numberOfLines={1}>
                  · {transaction.note}
                </Text>
              ) : null}
              {isExpense && !transaction.isPaid && <UnpaidBadge transactionId={transaction.id} />}
            </View>
            <CorrectionSummary
              transaction={transaction}
              isExpanded={isExpanded}
              onPress={() => setExpandedCorrectionsId(isExpanded ? null : transaction.id)}
            />
          </View>
          <Text className={`text-sm font-bold mr-3 ${isExpense ? 'text-gray-700' : 'text-green-600'}`}>
            {isExpense ? '-' : '+'}
            {mask(formatPLN(transaction.netAmount))}
          </Text>
          {!isFullyReturned && (
            <TouchableOpacity
              onPress={() => setCorrectingTransaction(transaction)}
              hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
              accessibilityLabel={t('finance.corrections.action')}
              className="mr-3"
            >
              <Ionicons name="arrow-undo-outline" size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setCopyingTransaction(transaction)}
            hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
            accessibilityLabel={t('finance.copyTransaction.action')}
            className="mr-3"
          >
            <Ionicons name="copy-outline" size={16} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(transaction)}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityLabel={t(DELETE_LABEL_KEY)}
          >
            <Ionicons name="trash-outline" size={16} color="#d1d5db" />
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded &&
          transaction.corrections.map(correction => (
            <View key={correction.id} className="flex-row items-center pl-16 pr-4 py-2.5 bg-emerald-50/40">
              <View className="flex-1">
                <Text className="text-xs font-medium text-emerald-700">{t('finance.corrections.sectionTitle')}</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xs text-gray-500">{correction.occurredOn}</Text>
                  {correction.note ? (
                    <Text className="text-xs text-gray-500 italic" numberOfLines={1}>
                      · {correction.note}
                    </Text>
                  ) : null}
                </View>
              </View>
              <Text className="text-xs font-bold text-emerald-600 mr-3">
                {isExpense ? '+' : '-'}
                {mask(formatPLN(correction.amount))}
              </Text>
              <TouchableOpacity
                onPress={() => handleDelete(correction)}
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                accessibilityLabel={t(DELETE_LABEL_KEY)}
              >
                <Ionicons name="trash-outline" size={14} color="#d1d5db" />
              </TouchableOpacity>
            </View>
          ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* A single month/year strip can't describe an all-time or custom range, so it's hidden for those. */}
      {(isMonthMode || filters.rangeMode === 'year') && (
        <YearMonthSelector year={year} month={month} onYearChange={setYear} onMonthChange={handleMonthChange} isMonthActive={isMonthMode} />
      )}

      {isMonthMode && (
        <View className="px-4 pt-3 pb-1 flex-row justify-between">
          <Text className="text-xs text-gray-500">
            {t('finance.history.incomeShort')} <Text className="font-bold text-green-600">{formatTotal(monthlySummary?.totalIncome)}</Text>
          </Text>
          <Text className="text-xs text-gray-500">
            {t('finance.history.expensesShort')} <Text className="font-bold text-gray-700">{formatTotal(monthlySummary?.totalExpense)}</Text>
          </Text>
        </View>
      )}

      <View className="px-4 pt-2 flex-row gap-2">
        <SearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder={t('finance.history.searchPlaceholder')}
          maxLength={SEARCH_MAX_LENGTH}
          testID="history-search"
        />
        <TouchableOpacity
          onPress={() => setFiltersVisible(true)}
          className={`${ICON_BUTTON_CLASS} ${activeFilterCount > 0 ? 'border-primary' : 'border-gray-200'}`}
          accessibilityLabel={t('finance.history.filters.title')}
          testID="history-filters-button"
        >
          <Ionicons name="options-outline" size={18} color={activeFilterCount > 0 ? '#1987EE' : '#6b7280'} />
          {activeFilterCount > 0 && (
            <View className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary items-center justify-center">
              <Text className="text-[10px] font-bold text-white">{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleExport} className={`${ICON_BUTTON_CLASS} border-gray-200`} accessibilityLabel={t('finance.export.title')}>
          <Ionicons name="download-outline" size={18} color="#6b7280" />
        </TouchableOpacity>
        {/* Copying from last month only means something relative to a single month. */}
        {isMonthMode && (
          <TouchableOpacity
            onPress={() => setCopyLastMonthVisible(true)}
            className={`${ICON_BUTTON_CLASS} border-gray-200`}
            accessibilityLabel={t('finance.copyLastMonth.action')}
          >
            <Ionicons name="copy-outline" size={18} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <View className="px-4 pt-3 pb-1">
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          {(
            [
              { key: 'all' as TypeFilter, label: t('finance.history.filterAll') },
              { key: FinanceTransactionTypeEnum.Expense, label: t('finance.history.filterExpenses') },
              { key: FinanceTransactionTypeEnum.Income, label: t('finance.history.filterIncome') },
            ] as const
          ).map(section => {
            const active = typeFilter === section.key;
            return (
              <ToggleTab key={section.key} active={active} onPress={() => handleTypeChange(section.key)}>
                <Text className={`text-xs font-bold ${active ? 'text-primary' : 'text-gray-500'}`}>{section.label}</Text>
              </ToggleTab>
            );
          })}
        </View>
      </View>

      {!isPlainMonth && transactionsPage && (
        <View className="px-4 pt-2 flex-row items-center justify-between">
          <Text className="text-xs text-gray-500">
            {t('finance.history.resultCount', { total: totalCount })}
            {loadedItems.length < totalCount ? ` · ${t('finance.history.loadedOf', { loaded: loadedItems.length })}` : ''}
          </Text>
          <TouchableOpacity onPress={handleClearAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text className="text-xs font-semibold text-primary">{t('finance.history.filters.clearAll')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isInitialLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1987EE" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#1987EE']} tintColor="#1987EE" />}
        >
          {loadedItems.length === 0 || isError ? (
            renderEmptyState()
          ) : (
            <>
              <View className="bg-white rounded-2xl shadow-sm overflow-hidden">{loadedItems.map(renderTransactionRow)}</View>
              {(hasMore || (isFetching && page > 1)) && (
                <TouchableOpacity
                  onPress={handleLoadMore}
                  disabled={!hasMore}
                  className="mt-3 items-center justify-center py-3 rounded-xl border border-gray-200 bg-white"
                  testID="history-load-more"
                >
                  {hasMore ? (
                    <Text className="text-sm font-semibold text-primary">{t('finance.history.loadMore')}</Text>
                  ) : (
                    <ActivityIndicator size="small" color="#1987EE" />
                  )}
                </TouchableOpacity>
              )}
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

      <AddTransactionModal isVisible={addModalVisible} onClose={closeWith(() => setAddModalVisible(false))} />
      <AddTransactionModal
        isVisible={editingTransaction !== null}
        onClose={closeWith(() => setEditingTransaction(null))}
        transaction={editingTransaction}
      />
      <AddCorrectionModal
        isVisible={correctingTransaction !== null}
        onClose={closeWith(() => setCorrectingTransaction(null))}
        transaction={correctingTransaction}
      />
      <CopyTransactionModal
        isVisible={copyingTransaction !== null}
        onClose={closeWith(() => setCopyingTransaction(null))}
        transaction={copyingTransaction}
        categoriesById={categoriesById}
      />
      <CopyFromLastMonthModal isVisible={copyLastMonthVisible} onClose={closeWith(() => setCopyLastMonthVisible(false))} year={year} month={month} />
      <HistoryFiltersModal
        isVisible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        filters={filters}
        onApply={setFilters}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
      />
    </View>
  );
};

export default History;
