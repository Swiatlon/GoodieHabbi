import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MiniStatCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bgClassName: string;
  label: string;
  value: string;
  caption?: string;
}

// Compact side-by-side alternative to a full-width colored box — two of these fit in the space one used to
// take, so "leftover from last month" + "saved this month" read as one glance instead of two separate cards.
const MiniStatCard: React.FC<MiniStatCardProps> = ({ icon, color, bgClassName, label, value, caption }) => (
  <View className={`flex-1 rounded-xl p-3 gap-1 ${bgClassName}`}>
    <View className="flex-row items-center gap-1.5">
      <Ionicons name={icon} size={13} color={color} />
      <Text className="text-[10px] font-bold uppercase tracking-wide flex-1" style={{ color }} numberOfLines={1}>
        {label}
      </Text>
    </View>
    <Text className="text-base font-bold" style={{ color }}>
      {value}
    </Text>
    {caption && (
      <Text className="text-[10px]" style={{ color }} numberOfLines={1}>
        {caption}
      </Text>
    )}
  </View>
);

export default MiniStatCard;
