import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName } from '@/utils/icons/ionicon-name';

interface KpiCardProps {
  label: string;
  value: string;
  icon: IoniconName;
  color: string;
  delta?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, color, delta }) => (
  <View className="flex-1 bg-white rounded-2xl shadow-sm p-3 items-center">
    <View className="w-9 h-9 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: `${color}18` }}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text className="text-base font-bold text-gray-800 text-center">{value}</Text>
    <Text className="text-xs text-gray-500 text-center mt-0.5">{label}</Text>
    {delta && <Text className="text-[10px] text-gray-400 text-center mt-0.5">{delta}</Text>}
  </View>
);

export default KpiCard;
