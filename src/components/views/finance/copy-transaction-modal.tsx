import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ModalFooterActions from '@/components/shared/modal/modal-footer-actions';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateTransactionMutation, useGetTransactionsQuery } from '@/redux/api/finance/finance-api';
import { getCategoryLabel, getTransactionVisual } from '@/utils/finance/category-helpers';
import { buildCopyTransactionPayload, DATE_FORMAT } from '@/utils/finance/form-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

const TARGET_MONTH_PAGE_SIZE = 100;

interface CopyTransactionModalProps extends IBaseModalProps {
  transaction: ITransaction | null;
  categoriesById: Map<number, IFinanceCategory>;
}

const CopyTransactionModal: React.FC<CopyTransactionModalProps> = ({ isVisible, onClose, transaction, categoriesById }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [targetYear, setTargetYear] = useState(() => dayjs().year());
  const [targetMonth, setTargetMonth] = useState(() => dayjs().month() + 1);

  // Defaults to the month right after the transaction's own — the common case is "add this recurring
  // thing to next month too", but the year/month picker below lets the user pick any other month.
  useEffect(() => {
    if (!isVisible || !transaction) return;
    const next = dayjs(transaction.occurredOn).add(1, 'month');
    setTargetYear(next.year());
    setTargetMonth(next.month() + 1);
  }, [isVisible, transaction]);

  const targetMonthStart = dayjs()
    .year(targetYear)
    .month(targetMonth - 1)
    .date(1);
  const { data: targetMonthPage } = useGetTransactionsQuery(
    {
      from: targetMonthStart.startOf('month').format(DATE_FORMAT),
      to: targetMonthStart.endOf('month').format(DATE_FORMAT),
      pageSize: TARGET_MONTH_PAGE_SIZE,
    },
    { skip: !isVisible || !transaction }
  );
  const existingInTargetMonth = transaction
    ? (targetMonthPage?.items ?? []).filter(tx => tx.categoryId === transaction.categoryId && tx.type === transaction.type)
    : [];
  const hasExactAmountMatch = transaction ? existingInTargetMonth.some(tx => tx.amount === transaction.amount) : false;

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleCopy = async () => {
    if (!transaction) return;

    try {
      await createTransaction(buildCopyTransactionPayload(transaction, targetYear, targetMonth)).unwrap();
      showSnackbar({ text: t('finance.copyTransaction.success'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('finance.copyTransaction.error'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const meta = transaction ? getTransactionVisual(categoriesById, transaction) : null;
  const isExpense = transaction ? transaction.type === FinanceTransactionTypeEnum.Expense : true;

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      isLoading={isLoading}
      loadingMessage={t('finance.copyTransaction.copying')}
      footer={
        <ModalFooterActions
          onCancel={handleClose}
          onConfirm={handleCopy}
          confirmIcon="copy-outline"
          confirmLabel={t('finance.copyTransaction.copyButton')}
        />
      }
    >
      <Text className="text-lg font-bold text-center mb-1">{t('finance.copyTransaction.title')}</Text>
      <Text className="text-xs text-gray-500 text-center mb-4">{t('finance.copyTransaction.hint')}</Text>

      {transaction && meta && (
        <View className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-4">
          <View className="w-9 h-9 rounded-lg items-center justify-center mr-2.5" style={{ backgroundColor: `${meta.color}20` }}>
            <Ionicons name={meta.icon} size={16} color={meta.color} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
              {getCategoryLabel(categoriesById, transaction.categoryId, t('finance.history.uncategorized'))}
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
        </View>
      )}

      <YearMonthSelector year={targetYear} month={targetMonth} onYearChange={setTargetYear} onMonthChange={setTargetMonth} />

      {existingInTargetMonth.length > 0 && (
        <View className="flex-row items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">
          <Ionicons name="information-circle-outline" size={18} color="#1987EE" />
          <Text className="flex-1 text-xs text-blue-800">
            {t(hasExactAmountMatch ? 'finance.copyTransaction.duplicateAmountWarning' : 'finance.copyTransaction.existingWarning', {
              count: existingInTargetMonth.length,
            })}
          </Text>
        </View>
      )}
    </Modal>
  );
};

export default CopyTransactionModal;
