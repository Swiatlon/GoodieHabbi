import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MultiSelectItem } from '../multi-select';

export const Chip = ({ item }: { item: MultiSelectItem }) => {
  return (
    <View className="rounded-full py-1 px-3" style={{ backgroundColor: item.backgroundColor || '#1987EE' }}>
      <Text className="text-[12px]" style={{ color: item.textColor || '#FFFFFF' }} numberOfLines={1}>
        {item.value}
      </Text>
    </View>
  );
};

export const MoreChip = ({ count }: { count: number }) => (
  <View className="bg-gray-300 rounded-full py-1 px-4">
    <Text className="text-white text-[12px]">+{count} more</Text>
  </View>
);

export const SelectionOption = React.memo(({ item, isSelected, onToggle }: { item: MultiSelectItem; isSelected: boolean; onToggle: () => void }) => (
  <TouchableOpacity className="flex-row items-center py-4 px-4 border-b border-gray-100" onPress={onToggle}>
    <Ionicons name={isSelected ? 'checkbox' : 'square-outline'} size={24} color={isSelected ? '#1987EE' : 'gray'} />
    <Text className="ml-3 text-base">{item.value}</Text>
  </TouchableOpacity>
));
