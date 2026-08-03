import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useUpdateTransactionPaidStatusMutation } from '@/redux/api/finance/finance-api';

interface UnpaidBadgeProps {
  transactionId: number;
}

// Shown on an expense row when the server says it hasn't been paid yet; tapping it marks it paid in place.
const UnpaidBadge: React.FC<UnpaidBadgeProps> = ({ transactionId }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [updateTransactionPaidStatus] = useUpdateTransactionPaidStatusMutation();

  const handlePress = async () => {
    try {
      await updateTransactionPaidStatus({ id: transactionId, data: { isPaid: true } }).unwrap();
      showSnackbar({ text: t('finance.paidStatus.markedPaidSuccess'), variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: t('finance.addTransaction.updatedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50">
      <Ionicons name="time-outline" size={10} color="#F59E0B" />
      <Text className="text-[10px] font-semibold text-amber-600">{t('finance.paidStatus.unpaid')}</Text>
    </TouchableOpacity>
  );
};

export default UnpaidBadge;
