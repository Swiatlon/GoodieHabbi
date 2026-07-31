import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteRecurringTransactionMutation, useGetRecurringTransactionsQuery } from '@/redux/api/finance/finance-api';
import { getCategoryLabel, getTransactionVisual } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

interface RecurringTransactionsModalProps extends IBaseModalProps {
  categoriesById: Map<number, IFinanceCategory>;
}

const DELETE_LABEL_KEY = 'common.delete';

// The backend doesn't have this endpoint yet — see docs/finance-backend-todo.md — so this renders empty/error
// states gracefully today and is ready to show real data the moment it ships.
const RecurringTransactionsModal: React.FC<RecurringTransactionsModalProps> = ({ isVisible, onClose, categoriesById }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: recurring = [], isLoading, isError } = useGetRecurringTransactionsQuery(undefined, { skip: !isVisible });
  const [deleteRecurringTransaction] = useDeleteRecurringTransactionMutation();

  const handleDelete = (id: number) => {
    Alert.alert(t('finance.recurring.deleteTitle'), t('finance.recurring.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t(DELETE_LABEL_KEY),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRecurringTransaction({ id }).unwrap();
          } catch {
            showSnackbar({ text: t('finance.recurring.deleteError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="pt-14 px-6">
      <Text className="text-lg font-bold text-center mb-1">{t('finance.recurring.title')}</Text>
      <Text className="text-xs text-gray-500 text-center mb-4">{t('finance.recurring.hint')}</Text>

      {isLoading ? (
        <Text className="text-sm text-gray-400 text-center py-6">{t('common.loading')}</Text>
      ) : isError ? (
        <Text className="text-sm text-gray-400 text-center py-6">{t('finance.recurring.loadError')}</Text>
      ) : recurring.length === 0 ? (
        <Text className="text-sm text-gray-400 text-center py-6">{t('finance.recurring.empty')}</Text>
      ) : (
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {recurring.map((item, idx) => {
            const visual = getTransactionVisual(categoriesById, item);
            return (
              <View key={item.id} className={`flex-row items-center px-3 py-2.5 ${idx < recurring.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="w-8 h-8 rounded-lg items-center justify-center mr-2.5" style={{ backgroundColor: `${visual.color}20` }}>
                  <Ionicons name={visual.icon} size={15} color={visual.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                    {getCategoryLabel(categoriesById, item.categoryId, t('finance.history.uncategorized'))}
                  </Text>
                  <Text className="text-xs text-gray-500">{t('finance.recurring.dayOfMonth', { day: item.dayOfMonth })}</Text>
                </View>
                <Text className="text-sm font-bold text-gray-700 mr-3">{formatPLN(item.amount)}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                  <Ionicons name="trash-outline" size={16} color="#d1d5db" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </Modal>
  );
};

export default RecurringTransactionsModal;
