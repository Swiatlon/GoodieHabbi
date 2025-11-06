import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/shared/button/button';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import Modal from '@/components/shared/modal/modal';
import { FilterValueType, ActualFilterData } from '@/hooks/use-filter/use-filter';

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
  testID?: string;
  title?: string;
}

const FilterModal = <T,>({
  isVisible,
  setIsVisible,
  setFilter,
  actualFilterData,
  filterCategories,
  testID = 'filter-modal',
  title = 'Filter',
}: FilterModalProps<T>) => {
  return (
    <Modal isVisible={isVisible} onClose={() => setIsVisible(false)} testID={`${testID}-modal`}>
      <View className="flex gap-4" testID={`${testID}-container`}>
        <Text className="text-lg font-semibold text-center" testID={`${testID}-title`}>
          {title}
        </Text>

        <View testID={`${testID}-categories-container`}>
          {Object.entries(filterCategories).map(([category, filtersMap]) => (
            <View key={category} testID={`${testID}-category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <Text className="text-md font-semibold ml-4 mb-2" testID={`${testID}-category-title-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                {category}:
              </Text>

              <View
                className="flex-row flex-wrap justify-around"
                testID={`${testID}-filters-container-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {Array.from(filtersMap.entries()).map(([filterKey, { value, icon, label, filterMainKey }]) => {
                  const isActive = actualFilterData[filterMainKey as keyof ActualFilterData] === value;
                  const filterTestId = `${testID}-filter-${filterKey.toLowerCase().replace(/\s+/g, '-')}`;

                  return (
                    <View key={filterKey} className="flex items-center p-2 w-1/3" testID={`${filterTestId}-container`}>
                      <IconButton
                        onPress={() => setFilter(filterMainKey as keyof T, isActive ? null : value)}
                        className="flex items-center"
                        testID={filterTestId}
                      >
                        <View testID={`${filterTestId}-icon`}>{icon}</View>
                        <Text className={`text-sm text-center ${isActive ? 'font-bold text-primary' : ''}`} testID={`${filterTestId}-label`}>
                          {label}
                        </Text>
                      </IconButton>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <Button label="Close" onPress={() => setIsVisible(false)} className="mx-auto px-6" testID={`${testID}-close-button`} />
      </View>
    </Modal>
  );
};

export default FilterModal;
