import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPLNCompact } from '@/utils/finance/format-pln';
import { IoniconName } from '@/utils/icons/ionicon-name';

interface BudgetProgressRowProps {
  icon: IoniconName;
  color: string;
  label: string;
  spent: number;
  // Undefined when the category has no explicit budget this period — the bar then falls back to a dimmed
  // share-of-total-spend indicator (shareOfTotal) instead of a progress-toward-limit one.
  limit?: number;
  shareOfTotal?: number;
  mask: (v: string) => string;
}

// Shared by MonthOverview and YearOverview's "budget vs actual" sections (previously ~30 duplicated lines
// in each file). The bar always renders in the category's own color — going over budget is flagged by the
// spent figure turning red, never by recoloring the whole bar, matching the Dashboard's category cards.
const BudgetProgressRow: React.FC<BudgetProgressRowProps> = ({ icon, color, label, spent, limit, shareOfTotal = 0, mask }) => {
  const { t } = useTranslation();
  const hasLimit = limit != null && limit > 0;
  const progress = hasLimit ? Math.min(spent / limit, 1) : Math.min(shareOfTotal, 1);
  const isOver = hasLimit && spent > limit;

  return (
    <View>
      <View className="flex-row items-center mb-1">
        <Ionicons name={icon} size={13} color={color} />
        <Text className="text-xs font-semibold text-gray-700 ml-1.5 flex-1" numberOfLines={1}>
          {label}
        </Text>
        <Text className="text-xs font-bold" style={{ color: isOver ? '#EF4444' : '#4b5563' }}>
          {mask(formatPLNCompact(spent))} zł
        </Text>
        {hasLimit && (
          <Text className="text-xs text-gray-400">
            {' '}
            {t('finance.expenses.ofBudgetLabel')} {mask(formatPLNCompact(limit))} zł
          </Text>
        )}
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: color, opacity: hasLimit ? 1 : 0.5 }} />
      </View>
    </View>
  );
};

export default BudgetProgressRow;
