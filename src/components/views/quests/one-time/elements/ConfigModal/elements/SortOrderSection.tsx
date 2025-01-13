import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SortOrderEnum } from '@/hooks/useSort';

interface SortOrderSectionProps {
  actualSortOrder: SortOrderEnum;
  setSortOrder: (order: SortOrderEnum) => void;
}

const SortOrderSection: React.FC<SortOrderSectionProps> = ({ actualSortOrder, setSortOrder }) => {
  return (
    <View>
      <Text className="text-lg font-semibold mb-4">Sort Order:</Text>
      <View className="flex-row justify-around">
        {[SortOrderEnum.ASC, SortOrderEnum.DESC].map(order => (
          <TouchableOpacity key={order} onPress={() => setSortOrder(order)} className="flex items-center p-2">
            <Ionicons
              name={order === SortOrderEnum.ASC ? 'arrow-up-outline' : 'arrow-down-outline'}
              size={36}
              color={actualSortOrder === order ? '#1987EE' : '#9e9e9e'}
            />
            <Text className={`mt-2 text-sm ${actualSortOrder === order ? 'font-bold text-blue-500' : 'text-black'}`}>
              {order === SortOrderEnum.ASC ? 'Ascending' : 'Descending'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SortOrderSection;
