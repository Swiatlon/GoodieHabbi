import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ISupplementChecklistItem } from '@/contract/supplements/supplements.contract';
import { getSupplementVisual } from '@/utils/supplements/supplement-visuals';

interface ChecklistItemProps {
  item: ISupplementChecklistItem;
  onToggle: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle }) => {
  const { t } = useTranslation();
  const visual = getSupplementVisual(item);

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} className="flex-row items-center px-4 py-3 bg-white" testID="checklist-item">
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${visual.color}20` }}>
        <Text className="text-lg">{visual.emoji}</Text>
      </View>
      <View className="flex-1 pr-3">
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
          {item.supplementName}
        </Text>
        <Text className="text-xs text-gray-500 mt-0.5">
          {item.takenAmount ?? item.plannedAmount} {t(`supplements.enums.unit.${item.unit}`)}
          {item.timeOfDay ? ` · ${item.timeOfDay}` : ''}
        </Text>
      </View>
      <Ionicons name={item.taken ? 'checkbox' : 'square-outline'} size={26} color={item.taken ? '#10B981' : '#9ca3af'} />
    </TouchableOpacity>
  );
};

export default ChecklistItem;
