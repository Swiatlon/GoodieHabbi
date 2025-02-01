import React from 'react';
import { View, Text } from 'react-native';
import { IFilterMapValues } from '../../../constants/quest-constants';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import { ActualFilterData, FilterValueType } from '@/hooks/use-filter';

interface FilterSectionProps<T> {
  actualFilterData: ActualFilterData;
  setFilter: (key: keyof T, value: FilterValueType) => void;
  filterCategories: Record<string, Map<string, IFilterMapValues>>;
}

const FilterSection = <T,>({ actualFilterData, setFilter, filterCategories }: FilterSectionProps<T>) => {
  return (
    <View className="flex gap-2">
      <Text className="text-lg font-semibold text-center">Filter Quests:</Text>

      {Object.entries(filterCategories).map(([category, filtersMap]) => (
        <View key={category}>
          <Text className="text-md font-semibold ml-4 mb-2">{category}:</Text>
          <View className="flex-row flex-wrap justify-around">
            {Array.from(filtersMap.entries()).map(([filterKey, { value, icon, label, filterMainKey }]) => {
              const isActive = actualFilterData[filterMainKey] === value;

              return (
                <View key={filterKey} className="flex items-center p-2 w-1/3">
                  <IconButton onPress={() => setFilter(filterMainKey as keyof T, value)} className="flex items-center">
                    {icon}
                    <Text className={`text-sm text-center ${isActive ? 'font-bold text-primary' : ''}`}>{label}</Text>
                  </IconButton>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export default FilterSection;
