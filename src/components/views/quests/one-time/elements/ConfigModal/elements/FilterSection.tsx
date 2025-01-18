import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quest, QuestFilterMap } from '../../../constants/QuestsConstants';
import { IconButton } from '@/components/shared/icon-button/IconButton';
import { ActualFilterData, FilterValueType } from '@/hooks/useFilter';

interface FilterSectionProps {
  actualFilterData: ActualFilterData;
  setFilter: (key: keyof Quest, value: FilterValueType) => void;
}

const filters = Array.from(QuestFilterMap.entries());

const FilterSection: React.FC<FilterSectionProps> = ({ actualFilterData, setFilter }) => {
  return (
    <View>
      <Text className="text-lg font-semibold mb-4 text-center">Filter Quests:</Text>
      <View className="flex-row flex-wrap justify-around">
        {filters.map(([key, { key: filterKey, value, icon, color }]) => {
          const isActive = actualFilterData.key === filterKey && actualFilterData.value === value;

          return (
            <IconButton
              key={key}
              onPress={() => {
                setFilter(filterKey, value);
              }}
              className="flex items-center p-2"
            >
              <Ionicons name={icon} size={28} color={color} />
              <Text className={`mt-2 text-sm ${isActive && `font-bold text-primary`}`}>
                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              </Text>
            </IconButton>
          );
        })}
      </View>
    </View>
  );
};

export default FilterSection;
