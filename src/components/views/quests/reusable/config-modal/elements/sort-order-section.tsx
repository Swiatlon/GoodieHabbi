import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import { SortOrderEnum, SortOrderEnumType } from '@/hooks/use-sort';

interface SortOrderSectionProps {
  actualSortOrder: SortOrderEnumType;
  setSortOrder: (order: SortOrderEnumType) => void;
}

const SortOrderSection: React.FC<SortOrderSectionProps> = ({ actualSortOrder, setSortOrder }) => {
  return (
    <View className="flex gap-2">
      <Text className="text-lg font-semibold text-center">Sort Order:</Text>
      <View className="flex-row justify-around">
        {[SortOrderEnum.ASC, SortOrderEnum.DESC].map(order => (
          <IconButton key={order} onPress={() => setSortOrder(order)} className="flex items-center p-2">
            <Ionicons
              name={order === SortOrderEnum.ASC ? 'arrow-up-outline' : 'arrow-down-outline'}
              size={28}
              color={actualSortOrder === order ? '#1987EE' : '#9e9e9e'}
            />
            <Text className={`mt-2 text-sm ${actualSortOrder === order ? 'font-bold text-blue-500' : 'text-black'}`}>
              {order === SortOrderEnum.ASC ? 'Ascending' : 'Descending'}
            </Text>
          </IconButton>
        ))}
      </View>
    </View>
  );
};

export default SortOrderSection;
