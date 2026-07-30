import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import YearMonthSelector from '@/components/views/finance/shared/year-month-selector';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateTransactionMutation } from '@/redux/api/finance/finance-api';
import { getTransactionVisual } from '@/utils/finance/category-helpers';
import { remapOccurredOnToMonth } from '@/utils/finance/form-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

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

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleCopy = async () => {
    if (!transaction) return;

    try {
      await createTransaction({
        type: transaction.type,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        note: transaction.note ?? undefined,
        occurredOn: remapOccurredOnToMonth(transaction.occurredOn, targetYear, targetMonth),
      }).unwrap();
      showSnackbar({ text: t('finance.copyTransaction.success'), variant: SnackbarVariantEnum.SUCCESS });
      onClose();
    } catch {
      showSnackbar({ text: t('finance.copyTransaction.error'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const category = transaction?.categoryId != null ? categoriesById.get(transaction.categoryId) : undefined;
  const meta = transaction ? getTransactionVisual(categoriesById, transaction) : null;
  const isExpense = transaction ? transaction.type === FinanceTransactionTypeEnum.Expense : true;

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      isLoading={isLoading}
      loadingMessage={t('finance.copyTransaction.copying')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={handleClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCopy} className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary">
            <Ionicons name="copy-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('finance.copyTransaction.copyButton')}</Text>
          </TouchableOpacity>
        </View>
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
              {category?.name ?? t('finance.history.uncategorized')}
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
    </Modal>
  );
};

export default CopyTransactionModal;
