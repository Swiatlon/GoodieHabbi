import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ISupplementChecklistItem } from '@/contract/supplements/supplements.contract';

interface ChecklistItemProps {
  item: ISupplementChecklistItem;
  onToggle: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center justify-between p-4 border-b border-gray-100" testID="checklist-item">
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-gray-800">{item.supplementName}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">
          {t(`supplements.enums.timing.${item.timing}`)} · {item.takenAmount ?? item.plannedAmount} {t(`supplements.enums.unit.${item.unit}`)}
        </Text>
      </View>
      <Ionicons name={item.taken ? 'checkbox' : 'square-outline'} size={26} color={item.taken ? '#10B981' : '#9ca3af'} />
    </TouchableOpacity>
  );
};

export default ChecklistItem;
