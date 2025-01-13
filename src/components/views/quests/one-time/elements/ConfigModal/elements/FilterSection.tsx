import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuestFilterMap } from '../../../constants/QuestsConstants';
import { FilterValueType } from '@/hooks/useFilter';

interface FilterSectionProps {
  actualFilterValue: FilterValueType;
  setFilter: (key: string, value: FilterValueType) => void;
}

const filters = Array.from(QuestFilterMap.entries());

const FilterSection: React.FC<FilterSectionProps> = ({ actualFilterValue, setFilter }) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-4">Filter Quests:</Text>
      <View className="flex-row justify-around">
        {filters.map(([key, value]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setFilter('completed', value as FilterValueType)}
            className="flex items-center p-2"
          >
            <Ionicons
              name={value === true ? 'checkmark-circle' : value === false ? 'alert-circle' : 'list'}
              size={36}
              color={value === true ? '#4caf50' : value === false ? '#ffc107' : '#1987EE'}
            />
            <Text className={`mt-2 text-sm ${value === actualFilterValue ? 'font-bold text-blue-500' : 'text-black'}`}>
              {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FilterSection;
