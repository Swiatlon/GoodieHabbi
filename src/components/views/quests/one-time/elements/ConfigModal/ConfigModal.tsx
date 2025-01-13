import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import FilterSection from './elements/FilterSection';
import SortKeySection from './elements/SortKeySection';
import SortOrderSection from './elements/SortOrderSection';
import { FilterValueType } from '@/hooks/useFilter';
import { SortOrderEnum } from '@/hooks/useSort';

interface ConfigModalProps {
  isModalVisible: boolean;
  actualSortOrder: SortOrderEnum;
  actualFilterValue: FilterValueType;
  actualSortKey: string | null;
  setisModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: (key: string, value: FilterValueType) => void;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrderEnum) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isModalVisible,
  actualFilterValue,
  actualSortKey,
  actualSortOrder,
  setisModalVisible,
  setSortOrder,
  setSortKey,
  setFilter,
}) => {
  return (
    <Modal transparent visible={isModalVisible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white w-4/5 rounded-lg p-6">
          <FilterSection actualFilterValue={actualFilterValue} setFilter={setFilter} />
          <SortOrderSection actualSortOrder={actualSortOrder} setSortOrder={setSortOrder} />
          <SortKeySection actualSortKey={actualSortKey} setSortKey={setSortKey} />
          <TouchableOpacity
            onPress={() => setisModalVisible(false)}
            className="mt-6 bg-gray-300 py-3 px-6 rounded-lg self-center"
          >
            <Text className="text-lg text-black">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfigModal;
