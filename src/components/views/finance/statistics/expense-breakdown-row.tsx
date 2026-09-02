import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPLNCompact } from '@/utils/finance/format-pln';
import { IoniconName } from '@/utils/icons/ionicon-name';

interface ExpenseBreakdownRowProps {
  icon: IoniconName;
  color: string;
  label: string;
  amount: number;
  percentage: number;
  // 0-100, relative to the single biggest category this period — not to the shared total — so the longest
  // bar always reaches full width and the rest scale visibly against it. Comparing bar length is something
  // people are actually good at, unlike comparing pie-slice angles or areas.
  barWidthPct: number;
  mask: (v: string) => string;
}

const ExpenseBreakdownRow: React.FC<ExpenseBreakdownRowProps> = ({ icon, color, label, amount, percentage, barWidthPct, mask }) => (
  <View>
    <View className="flex-row items-center mb-1">
      <Ionicons name={icon} size={13} color={color} />
      <Text className="text-xs font-semibold text-gray-700 ml-1.5 flex-1" numberOfLines={1}>
        {label}
      </Text>
      <Text className="text-xs text-gray-400 mr-2">{Math.round(percentage)}%</Text>
      <Text className="text-xs font-bold text-gray-800">{mask(formatPLNCompact(amount))} zł</Text>
    </View>
    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <View className="h-full rounded-full" style={{ width: `${barWidthPct}%`, backgroundColor: color }} />
    </View>
  </View>
);

export default ExpenseBreakdownRow;
