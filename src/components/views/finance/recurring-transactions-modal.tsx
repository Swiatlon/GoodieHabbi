import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecurringTransactionFormModal from './recurring-transaction-form-modal';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import { FinanceTransactionTypeEnum, IFinanceCategory, IRecurringTransaction } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import {
  useDeleteRecurringTransactionMutation,
  useGetRecurringTransactionsQuery,
  useUpdateRecurringTransactionMutation,
} from '@/redux/api/finance/finance-api';
import { getCategoryLabel, getTransactionVisual } from '@/utils/finance/category-helpers';
import { formatPLN } from '@/utils/finance/format-pln';

interface RecurringTransactionsModalProps extends IBaseModalProps {
  categoriesById: Map<number, IFinanceCategory>;
}

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

const RecurringTransactionsModal: React.FC<RecurringTransactionsModalProps> = ({ isVisible, onClose, categoriesById }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: recurring = [], isLoading, isError } = useGetRecurringTransactionsQuery(undefined, { skip: !isVisible });
  const [deleteRecurringTransaction] = useDeleteRecurringTransactionMutation();
  const [updateRecurringTransaction] = useUpdateRecurringTransactionMutation();

  const [formTemplate, setFormTemplate] = useState<IRecurringTransaction | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const openForm = (template: IRecurringTransaction | null) => {
    setFormTemplate(template);
    setFormVisible(true);
  };

  // Pausing keeps the template and its history; deleting is the destructive one, hence the confirmation.
  const handleToggleActive = async (item: IRecurringTransaction) => {
    try {
      await updateRecurringTransaction({ id: item.id, data: { isActive: !item.isActive } }).unwrap();
    } catch {
      showSnackbar({ text: t('finance.recurring.toggleError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(t('finance.recurring.deleteTitle'), t('finance.recurring.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
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

  const renderRow = (item: IRecurringTransaction, isLast: boolean) => {
    const visual = getTransactionVisual(categoriesById, item);
    const isExpense = item.type === FinanceTransactionTypeEnum.Expense;
    const label = getCategoryLabel(categoriesById, item.categoryId, t('finance.history.uncategorized'));
    const note = item.note?.trim();

    return (
      <View key={item.id} className={`px-3 py-2.5 ${isLast ? '' : 'border-b border-gray-50'} ${item.isActive ? '' : 'opacity-50'}`}>
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-lg items-center justify-center mr-2.5" style={{ backgroundColor: `${visual.color}20` }}>
            <Ionicons name={visual.icon} size={15} color={visual.color} />
          </View>

          <View className="flex-1 mr-2">
            {/* The note is what tells two templates in the same category apart ("Netflix" vs "Spotify"). */}
            <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
              {note || label}
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {note ? `${label} · ` : ''}
              {t('finance.recurring.dayOfMonth', { day: item.dayOfMonth })}
            </Text>
          </View>

          {/* Income and expense templates shared one undifferentiated look before — the sign and colour are
              what stop a 5000 salary from reading like a 5000 bill. */}
          <Text className={`text-sm font-bold mr-3 ${isExpense ? 'text-gray-700' : 'text-green-600'}`}>
            {isExpense ? '' : '+'}
            {formatPLN(item.amount)}
          </Text>

          <View className="flex-row items-center gap-3">
            {/* `void`: the handler reports its own failures via snackbar, so there is nothing to await here. */}
            <TouchableOpacity
              onPress={() => void handleToggleActive(item)}
              hitSlop={HIT_SLOP}
              accessibilityLabel={t('finance.recurring.togglePause')}
            >
              <Ionicons name={item.isActive ? 'pause-circle-outline' : 'play-circle-outline'} size={18} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openForm(item)} hitSlop={HIT_SLOP} accessibilityLabel={t('common.edit')}>
              <Ionicons name="create-outline" size={17} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={HIT_SLOP} accessibilityLabel={t('common.delete')}>
              <Ionicons name="trash-outline" size={16} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {!item.isActive && <Text className="text-[10px] text-amber-600 mt-1 ml-11">{t('finance.recurring.pausedBadge')}</Text>}
      </View>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return <Text className="text-sm text-gray-400 text-center py-6">{t('common.loading')}</Text>;
    }

    if (isError) {
      return <Text className="text-sm text-gray-400 text-center py-6">{t('finance.recurring.loadError')}</Text>;
    }

    if (recurring.length === 0) {
      return <Text className="text-sm text-gray-400 text-center py-6">{t('finance.recurring.empty')}</Text>;
    }

    return (
      <ScrollView className="max-h-96">
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {recurring.map((item, index) => renderRow(item, index === recurring.length - 1))}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <Modal isVisible={isVisible} onClose={onClose} className="pt-14 px-6">
        <Text className="text-lg font-bold text-center mb-1">{t('finance.recurring.title')}</Text>
        <Text className="text-xs text-gray-500 text-center mb-4">{t('finance.recurring.hint')}</Text>

        {renderBody()}

        <TouchableOpacity
          onPress={() => openForm(null)}
          className="flex-row items-center justify-center gap-1.5 mt-4 py-2.5 rounded-xl bg-primary"
          testID="recurring-add-button"
        >
          <Ionicons name="add-circle-outline" size={18} color="white" />
          <Text className="text-sm font-semibold text-white">{t('finance.recurring.add')}</Text>
        </TouchableOpacity>
      </Modal>

      <RecurringTransactionFormModal isVisible={isFormVisible} onClose={() => setFormVisible(false)} template={formTemplate} />
    </>
  );
};

export default RecurringTransactionsModal;
