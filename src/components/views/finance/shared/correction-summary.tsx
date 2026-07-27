import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ITransaction } from '@/contract/finance/finance.contract';
import { formatPLN } from '@/utils/finance/format-pln';

interface CorrectionSummaryProps {
  transaction: ITransaction;
  onPress?: () => void;
  isExpanded?: boolean;
}

/**
 * The one extra line a corrected transaction gets in a list: "↩ 300 zł returned of 400 zł".
 * Renders nothing when nothing came back, so uncorrected rows stay exactly as quiet as before.
 */
const CorrectionSummary: React.FC<CorrectionSummaryProps> = ({ transaction, onPress, isExpanded }) => {
  const { t } = useTranslation();

  if (transaction.correctedAmount <= 0) return null;

  const label = t('finance.corrections.returnedBadge', {
    amount: formatPLN(transaction.correctedAmount),
    original: formatPLN(transaction.amount),
  });

  const content = (
    <View className="flex-row items-center gap-1">
      <Ionicons name="arrow-undo-outline" size={11} color="#10B981" />
      <Text className="text-[11px] font-medium text-emerald-600">{label}</Text>
      {onPress ? <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={11} color="#10B981" /> : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} accessibilityLabel={label}>
      {content}
    </TouchableOpacity>
  );
};

export default CorrectionSummary;
