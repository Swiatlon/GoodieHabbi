import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuestType, QuestKeyType, QuestFilterMap } from '../../../constants/quest-constants';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import { ActualFilterData, FilterValueType } from '@/hooks/use-filter';

interface FilterSectionProps<T extends QuestType> {
  actualFilterData: ActualFilterData;
  setFilter: (key: QuestKeyType<T>, value: FilterValueType) => void;
}

const filters = Array.from(QuestFilterMap.entries());

const FilterSection = <T extends QuestType>({ actualFilterData, setFilter }: FilterSectionProps<T>) => {
  return (
    <View className="flex gap-4">
      <Text className="text-lg font-semibold text-center">Filter Quests:</Text>
      <View className="flex-row flex-wrap justify-around">
        {filters.map(([key, { key: filterKey, value, icon, color, label }]) => {
          const isActive = actualFilterData.key === filterKey && actualFilterData.value === value;

          return (
            <View key={key} className="flex items-center p-2 w-1/3">
              <IconButton
                onPress={() => {
                  setFilter(filterKey, value);
                }}
                className="flex items-center"
              >
                <Ionicons name={icon} size={28} color={color} />
                <Text className={`text-sm text-center ${isActive && `font-bold text-primary`}`}>{label}</Text>
              </IconButton>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FilterSection;
