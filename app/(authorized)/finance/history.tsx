import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeableRow from '@/components/shared/swipeable-row/swipeable-row';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import AddCorrectionModal from '@/components/views/finance/add-correction-modal';
import AddTransactionModal from '@/components/views/finance/add-transaction-modal';
import CopyFromLastMonthModal from '@/components/views/finance/copy-from-last-month-modal';
import CopyTransactionModal from '@/components/views/finance/copy-transaction-modal';
import CorrectionSummary from '@/components/views/finance/shared/correction-summary';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, ITransaction } from '@/contract/finance/finance.contract';
import { useFinanceMonth } from '@/providers/finance/finance-month-context';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteTransactionMutation, useGetFinanceCategoriesQuery, useGetTransactionsQuery } from '@/redux/api/finance/finance-api';
import { buildCategoriesById, getTransactionVisual } from '@/utils/finance/category-helpers';
import { buildExportRows, shareFinanceExport } from '@/utils/finance/export';
import { formatPLN } from '@/utils/finance/format-pln';

type TypeFilter = 'all' | FinanceTransactionTypeEnum;

const TRANSACTIONS_PAGE_SIZE = 100;
const DELETE_LABEL_KEY = 'common.delete';

const History = () => {
  const { t } = useTranslation();
  const { year, month, setYear, setMonth } = useFinanceMonth();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [correctingTransaction, setCorrectingTransaction] = useState<ITransaction | null>(null);
  const [copyingTransaction, setCopyingTransaction] = useState<ITransaction | null>(null);
  const [copyLastMonthVisible, setCopyLastMonthVisible] = useState(false);
  const [expandedCorrectionsId, setExpandedCorrectionsId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const { hideNumbers } = useFinanceDisplay();
  const mask = (v: string) => (hideNumbers ? '***' : v);
  const { showSnackbar } = useSnackbar();

  const monthStart = dayjs()
    .year(year)
    .month(month - 1)
    .date(1);
  const from = monthStart.startOf('month').format('YYYY-MM-DD');
  const to = monthStart.endOf('month').format('YYYY-MM-DD');

  const {
    data: transactionsPage,
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({ from, to, pageSize: TRANSACTIONS_PAGE_SIZE });
  const { data: expenseCategories = [], isLoading: loadingExpenseCategories } = useGetFinanceCategoriesQuery({
    type: FinanceTransactionTypeEnum.Expense,
  });
  const { data: incomeCategories = [], isLoading: loadingIncomeCategories } = useGetFinanceCategoriesQuery({
    type: FinanceTransactionTypeEnum.Income,
  });
  const [deleteTransaction] = useDeleteTransactionMutation();

  const categoriesById = useMemo(() => buildCategoriesById([...expenseCategories, ...incomeCategories]), [expenseCategories, incomeCategories]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchTransactions();
    setRefreshing(false);
  };

  const allTransactions = transactionsPage?.items ?? [];

  const getLabel = (transaction: ITransaction) => {
    if (transaction.categoryId == null) return t('finance.history.uncategorized');
    return categoriesById.get(transaction.categoryId)?.name ?? t('finance.history.uncategorized');
  };

  const getMeta = (transaction: ITransaction) => getTransactionVisual(categoriesById, transaction);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
      if (!search.trim()) return true;
      const query = search.trim().toLowerCase();
      return getLabel(transaction).toLowerCase().includes(query) || (transaction.note ?? '').toLowerCase().includes(query);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTransactions, typeFilter, search, categoriesById]);

  // Summed from netAmount, not amount — anything built from `amount` disagrees with every server aggregate
  // once a transaction has been partly refunded.
  const totalIncome = useMemo(
    () => allTransactions.filter(tx => tx.type === FinanceTransactionTypeEnum.Income).reduce((sum, tx) => sum + tx.netAmount, 0),
    [allTransactions]
  );
  const totalExpenses = useMemo(
    () => allTransactions.filter(tx => tx.type === FinanceTransactionTypeEnum.Expense).reduce((sum, tx) => sum + tx.netAmount, 0),
    [allTransactions]
  );

  const handleDelete = (transaction: ITransaction) => {
    const isCorrection = transaction.correctsTransactionId != null;
    Alert.alert(
      t(isCorrection ? 'finance.corrections.deleteTitle' : 'finance.history.deleteTitle'),
      t(isCorrection ? 'finance.corrections.deleteMessage' : 'finance.history.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t(DELETE_LABEL_KEY), style: 'destructive', onPress: async () => deleteTransaction({ id: transaction.id }) },
      ]
    );
  };

  const isLoading = loadingTransactions || loadingExpenseCategories || loadingIncomeCategories;

  const handleExport = () => {
    Alert.alert(t('finance.export.title'), undefined, [
      { text: 'CSV', onPress: async () => runExport('csv') },
      { text: 'JSON', onPress: async () => runExport('json') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const runExport = async (format: 'csv' | 'json') => {
    try {
      const categoryNameById = new Map<number, string>([...categoriesById].map(([id, cat]) => [id, cat.name]));
      const rows = buildExportRows(filteredTransactions, categoryNameById);
      await shareFinanceExport(rows, year, month, format);
    } catch {
      showSnackbar({ text: t('finance.export.error'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <YearMonthSelector year={year} month={month} onYearChange={setYear} onMonthChange={setMonth} />

      <View className="px-4 pt-3 pb-1 flex-row justify-between">
        <Text className="text-xs text-gray-500">
          {t('finance.history.incomeShort')} <Text className="font-bold text-green-600">{mask(formatPLN(totalIncome))}</Text>
        </Text>
        <Text className="text-xs text-gray-500">
          {t('finance.history.expensesShort')} <Text className="font-bold text-gray-700">{mask(formatPLN(totalExpenses))}</Text>
        </Text>
      </View>

      <View className="px-4 pt-2 flex-row gap-2">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3">
          <Ionicons name="search-outline" size={16} color="#9ca3af" />
          <TextInput
            className="flex-1 py-2.5 px-2 text-sm text-gray-800"
            placeholder={t('finance.history.searchPlaceholder')}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={handleExport}
          className="w-10 h-10 items-center justify-center bg-white border border-gray-200 rounded-xl"
          accessibilityLabel={t('finance.export.title')}
        >
          <Ionicons name="download-outline" size={18} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCopyLastMonthVisible(true)}
          className="w-10 h-10 items-center justify-center bg-white border border-gray-200 rounded-xl"
          accessibilityLabel={t('finance.copyLastMonth.action')}
        >
          <Ionicons name="copy-outline" size={18} color="#6b7280" />
        </TouchableOpacity>
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
              <ToggleTab key={section.key} active={active} onPress={() => setTypeFilter(section.key)}>
                <Text className={`text-xs font-bold ${active ? 'text-primary' : 'text-gray-500'}`}>{section.label}</Text>
              </ToggleTab>
            );
          })}
        </View>
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
          {filteredTransactions.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-base mt-3">{t('finance.history.noResults')}</Text>
            </View>
          ) : (
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {filteredTransactions.map((transaction, idx) => {
                const meta = getMeta(transaction);
                const isExpense = transaction.type === FinanceTransactionTypeEnum.Expense;
                const isExpanded = expandedCorrectionsId === transaction.id;
                const isFullyReturned = transaction.correctedAmount >= transaction.amount;
                return (
                  <View key={transaction.id} className={idx < filteredTransactions.length - 1 ? 'border-b border-gray-50' : ''}>
                    <SwipeableRow onDelete={() => handleDelete(transaction)} onCopy={() => setCopyingTransaction(transaction)}>
                      <TouchableOpacity
                        onPress={() => setEditingTransaction(transaction)}
                        activeOpacity={0.7}
                        className="flex-row items-center px-4 py-3 bg-white"
                      >
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
                    </SwipeableRow>

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
              })}
            </View>
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

      <AddTransactionModal isVisible={addModalVisible} onClose={() => setAddModalVisible(false)} />
      <AddTransactionModal isVisible={editingTransaction !== null} onClose={() => setEditingTransaction(null)} transaction={editingTransaction} />
      <AddCorrectionModal
        isVisible={correctingTransaction !== null}
        onClose={() => setCorrectingTransaction(null)}
        transaction={correctingTransaction}
      />
      <CopyTransactionModal
        isVisible={copyingTransaction !== null}
        onClose={() => setCopyingTransaction(null)}
        transaction={copyingTransaction}
        categoriesById={categoriesById}
      />
      <CopyFromLastMonthModal isVisible={copyLastMonthVisible} onClose={() => setCopyLastMonthVisible(false)} year={year} month={month} />
    </View>
  );
};

export default History;
