import React, { ReactElement } from 'react';
import { View, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { IconButton } from '@/components/shared/icon-button/icon-button';
import Modal from '@/components/shared/modal/modal';
import { SortOrderEnum, SortOrderEnumType } from '@/hooks/use-sort';

interface SortModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  actualSortKey: string | null;
  setActualSortKeys: (key: string | null, objKey: string | null) => void;
  actualSortOrder: SortOrderEnumType;
  setSortOrder: (order: SortOrderEnumType) => void;
  sortOptions?: SortOption[];
}

export interface SortOption {
  key: string;
  objKey: string;
  icon: ReactElement;
  label: string;
  color: string;
}

const defaultSortOptions: SortOption[] = [
  { key: 'title', objKey: 'title', icon: <Ionicons name="text-outline" size={28} />, label: 'Title', color: '#000000' },
  { key: 'startDate', objKey: 'startDate', icon: <Ionicons name="calendar-outline" size={28} />, label: 'Start Date', color: '#FF8C00' },
  { key: 'endDate', objKey: 'endDate', icon: <Ionicons name="calendar-outline" size={28} />, label: 'End Date', color: '#20B2AA' },
  { key: 'priority', objKey: 'priority', icon: <MaterialIcons name="flag" size={28} />, label: 'Priority', color: '#FF4500' },
  { key: 'isCompleted', objKey: 'isCompleted', icon: <Ionicons name="checkmark-done-outline" size={28} />, label: 'Completed', color: '#32CD32' },
  {
    key: 'timeLeft',
    objKey: 'endDate',
    icon: <Ionicons name="time-outline" size={28} />,
    label: 'Time Left',
    color: '#cc0000',
  },
];

const SortModal: React.FC<SortModalProps> = ({
  isVisible,
  setIsVisible,
  actualSortKey,
  setActualSortKeys,
  actualSortOrder,
  setSortOrder,
  sortOptions = defaultSortOptions,
}) => {
  return (
    <Modal isVisible={isVisible} onClose={() => setIsVisible(false)}>
      <View className="flex gap-4">
        <Text className="text-lg font-semibold text-center">Sort Quests</Text>

        <View className="flex gap-2">
          <Text className="text-md font-semibold ml-4">Sort By:</Text>
          <View className="flex-row flex-wrap justify-around">
            {sortOptions.map(({ key, objKey, icon, label, color }) => {
              const isActive = actualSortKey === key;

              return (
                <View key={key} className="flex items-center p-2 w-1/3">
                  <IconButton onPress={() => setActualSortKeys(key, objKey)} className="flex items-center">
                    {React.cloneElement(icon, { color: isActive ? '#1987EE' : color })}
                    <Text className={`text-sm mt-1 text-center flex-wrap ${isActive ? 'font-bold text-blue-500' : 'text-black'}`}>{label}</Text>
                  </IconButton>
                </View>
              );
            })}
          </View>
        </View>

        <View className="flex gap-2">
          <Text className="text-md font-semibold ml-4">Sort Order:</Text>
          <View className="flex-row justify-around">
            {[SortOrderEnum.ASC, SortOrderEnum.DESC].map(order => {
              const isActive = actualSortOrder === order;

              return (
                <View key={order} className="flex items-center p-2 w-1/2">
                  <IconButton onPress={() => setSortOrder(order)} className="flex items-center">
                    <Ionicons
                      name={order === SortOrderEnum.ASC ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'}
                      size={28}
                      color={isActive ? '#1987EE' : order === SortOrderEnum.ASC ? '#32CD32' : '#FF6347'}
                    />
                    <Text className={`mt-1 text-sm text-center flex-wrap ${isActive ? 'font-bold text-blue-500' : 'text-black'}`}>
                      {order === SortOrderEnum.ASC ? 'Ascending' : 'Descending'}
                    </Text>
                  </IconButton>
                </View>
              );
            })}
          </View>
        </View>

        {/* Close Button */}
        <Button label="Close" onPress={() => setIsVisible(false)} className="mx-auto px-6" />
      </View>
    </Modal>
  );
};

export default SortModal;
