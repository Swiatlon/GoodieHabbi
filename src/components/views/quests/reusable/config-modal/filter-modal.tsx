import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/shared/button/button';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import Modal from '@/components/shared/modal/modal';
import { FilterValueType, ActualFilterData } from '@/hooks/use-filter';

export type QuestKeyType<T> = keyof T;

export interface IFilterMapValues<T> {
  filterMainKey: QuestKeyType<T>;
  value: FilterValueType;
  icon: React.ReactNode;
  color: string;
  label: string;
}

interface FilterModalProps<T> {
  isVisible: boolean;
  actualFilterData: ActualFilterData;
  filterCategories: Record<string, Map<string, IFilterMapValues<T>>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: (key: QuestKeyType<T>, value: FilterValueType) => void;
}

const FilterModal = <T,>({ isVisible, setIsVisible, setFilter, actualFilterData, filterCategories }: FilterModalProps<T>) => {
  return (
    <Modal isVisible={isVisible} onClose={() => setIsVisible(false)}>
      <View className="flex gap-4">
        <Text className="text-lg font-semibold text-center">Filter Quests</Text>

        {Object.entries(filterCategories).map(([category, filtersMap]) => (
          <View key={category}>
            <Text className="text-md font-semibold ml-4 mb-2">{category}:</Text>
            <View className="flex-row flex-wrap justify-around">
              {Array.from(filtersMap.entries()).map(([filterKey, { value, icon, label, filterMainKey }]) => {
                const isActive = actualFilterData[filterMainKey as keyof ActualFilterData] === value;
                return (
                  <View key={filterKey} className="flex items-center p-2 w-1/3">
                    <IconButton onPress={() => setFilter(filterMainKey as keyof T, isActive ? null : value)} className="flex items-center">
                      {icon}
                      <Text className={`text-sm text-center ${isActive ? 'font-bold text-primary' : ''}`}>{label}</Text>
                    </IconButton>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <Button label="Close" onPress={() => setIsVisible(false)} className="mx-auto px-6" />
      </View>
    </Modal>
  );
};

export default FilterModal;
