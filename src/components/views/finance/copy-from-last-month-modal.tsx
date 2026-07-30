import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, ITransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateTransactionMutation, useGetFinanceCategoriesQuery, useGetTransactionsQuery } from '@/redux/api/finance/finance-api';
import { buildCategoriesById, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

interface CopyFromLastMonthModalProps extends IBaseModalProps {
  year: number;
  month: number;
}

const DATE_FORMAT = 'YYYY-MM-DD';
const TRANSACTIONS_PAGE_SIZE = 100;
const EXPENSE_DEFAULT_COLOR = '#6b7280';
const INCOME_DEFAULT_COLOR = '#10B981';

const getPreviousMonth = (year: number, month: number) => (month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 });

// Keeps the same day-of-month, clamped into the target month (e.g. the 31st copied into a 30-day month lands on the 30th).
const remapOccurredOn = (occurredOn: string, targetYear: number, targetMonth: number) => {
  const day = dayjs(occurredOn).date();
  const targetMonthStart = dayjs()
    .year(targetYear)
    .month(targetMonth - 1)
    .date(1);
  const clampedDay = Math.min(day, targetMonthStart.endOf('month').date());
  return targetMonthStart.date(clampedDay).format(DATE_FORMAT);
};

const CopyFromLastMonthModal: React.FC<CopyFromLastMonthModalProps> = ({ isVisible, onClose, year, month }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createTransaction] = useCreateTransactionMutation();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isCopying, setIsCopying] = useState(false);

  const { year: prevYear, month: prevMonth } = getPreviousMonth(year, month);
  const monthStart = dayjs()
    .year(prevYear)
    .month(prevMonth - 1)
    .date(1);
  const from = monthStart.startOf('month').format(DATE_FORMAT);
  const to = monthStart.endOf('month').format(DATE_FORMAT);

  const { data: transactionsPage, isLoading: loadingTransactions } = useGetTransactionsQuery(
    { from, to, pageSize: TRANSACTIONS_PAGE_SIZE },
    { skip: !isVisible }
  );
  const { data: expenseCategories = [] } = useGetFinanceCategoriesQuery({ type: FinanceTransactionTypeEnum.Expense }, { skip: !isVisible });
  const { data: incomeCategories = [] } = useGetFinanceCategoriesQuery({ type: FinanceTransactionTypeEnum.Income }, { skip: !isVisible });
  const categoriesById = useMemo(() => buildCategoriesById([...expenseCategories, ...incomeCategories]), [expenseCategories, incomeCategories]);

  const previousTransactions = transactionsPage?.items ?? [];

  useEffect(() => {
    if (!isVisible) setSelectedIds(new Set());
  }, [isVisible]);

  const toggleSelected = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => (prev.size === previousTransactions.length ? new Set() : new Set(previousTransactions.map(tx => tx.id))));
  };

  const getMeta = (transaction: ITransaction) => {
    const category = transaction.categoryId != null ? categoriesById.get(transaction.categoryId) : undefined;
    const isExpense = transaction.type === FinanceTransactionTypeEnum.Expense;
    return {
      icon: resolveCategoryIcon(category?.icon),
      color: category?.color ?? (isExpense ? EXPENSE_DEFAULT_COLOR : INCOME_DEFAULT_COLOR),
      label: category?.name ?? t('finance.history.uncategorized'),
    };
  };

  const handleClose = () => {
    if (isCopying) return;
    onClose();
  };

  const handleCopy = async () => {
    const toCopy = previousTransactions.filter(tx => selectedIds.has(tx.id));
    if (toCopy.length === 0) return;

    setIsCopying(true);
    const results = await Promise.allSettled(
      toCopy.map(async tx =>
        createTransaction({
          type: tx.type,
          amount: tx.amount,
          categoryId: tx.categoryId,
          note: tx.note ?? undefined,
          occurredOn: remapOccurredOn(tx.occurredOn, year, month),
        }).unwrap()
      )
    );
    setIsCopying(false);

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - succeeded;

    if (failed === 0) {
      showSnackbar({ text: t('finance.copyLastMonth.success', { count: succeeded }), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } else if (succeeded === 0) {
      showSnackbar({ text: t('finance.copyLastMonth.error'), variant: SnackbarVariantEnum.ERROR });
    } else {
      showSnackbar({
        text: t('finance.copyLastMonth.partial', { succeeded, total: results.length }),
        variant: SnackbarVariantEnum.INFO,
      });
      onClose();
    }
  };

  const isLoading = loadingTransactions;
  const allSelected = previousTransactions.length > 0 && selectedIds.size === previousTransactions.length;

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      isLoading={isCopying}
      loadingMessage={t('finance.copyLastMonth.copying')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={handleClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCopy}
            disabled={selectedIds.size === 0}
            className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${selectedIds.size > 0 ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <Ionicons name="copy-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('finance.copyLastMonth.copyButton', { count: selectedIds.size })}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text className="text-lg font-bold text-center mb-1">{t('finance.copyLastMonth.title')}</Text>
      <Text className="text-xs text-gray-500 text-center mb-4">{t('finance.copyLastMonth.hint')}</Text>

      {isLoading ? (
        <Text className="text-sm text-gray-400 text-center py-6">{t('common.loading')}</Text>
      ) : previousTransactions.length === 0 ? (
        <Text className="text-sm text-gray-400 text-center py-6">{t('finance.copyLastMonth.empty')}</Text>
      ) : (
        <>
          <TouchableOpacity onPress={toggleSelectAll} className="self-end mb-2">
            <Text className="text-xs font-semibold text-primary">
              {t(allSelected ? 'finance.copyLastMonth.deselectAll' : 'finance.copyLastMonth.selectAll')}
            </Text>
          </TouchableOpacity>

          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {previousTransactions.map((transaction, idx) => {
              const meta = getMeta(transaction);
              const isExpense = transaction.type === FinanceTransactionTypeEnum.Expense;
              const isSelected = selectedIds.has(transaction.id);
              return (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() => toggleSelected(transaction.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center px-3 py-2.5 ${idx < previousTransactions.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isSelected ? '#1987EE' : '#d1d5db'}
                    style={{ marginRight: 10 }}
                  />
                  <View className="w-8 h-8 rounded-lg items-center justify-center mr-2.5" style={{ backgroundColor: `${meta.color}20` }}>
                    <Ionicons name={meta.icon} size={15} color={meta.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                      {meta.label}
                    </Text>
                    {transaction.note ? (
                      <Text className="text-xs text-gray-500" numberOfLines={1}>
                        {transaction.note}
                      </Text>
                    ) : null}
                  </View>
                  <Text className={`text-sm font-bold ${isExpense ? 'text-gray-700' : 'text-green-600'}`}>
                    {isExpense ? '-' : '+'}
                    {formatPLN(transaction.amount)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </Modal>
  );
};

export default CopyFromLastMonthModal;
