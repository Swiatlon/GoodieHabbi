import { View } from 'react-native';
import FilterSection from './elements/filter-section';
import SortKeySection from './elements/sort-key-section';
import SortOrderSection from './elements/sort-order-section';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { FilterValueType, ActualFilterData } from '@/hooks/use-filter';
import { SortOrderEnumType } from '@/hooks/use-sort';

export type QuestKeyType<T> = keyof T;

export interface IFilterMapValues<T> {
  filterMainKey: QuestKeyType<T>;
  value: FilterValueType;
  icon: React.ReactNode;
  color: string;
  label: string;
}

interface ConfigModalProps<T> {
  isModalVisible: boolean;
  actualSortOrder: SortOrderEnumType;
  actualSortKey: string | null;
  withoutDate?: boolean;
  actualFilterData: ActualFilterData;
  filterCategories: Record<string, Map<string, IFilterMapValues<T>>>;
  setisModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: (key: QuestKeyType<T>, value: FilterValueType) => void;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrderEnumType) => void;
}

const ConfigModal = <T,>({
  isModalVisible,
  actualSortKey,
  actualSortOrder,
  withoutDate,
  setisModalVisible,
  setSortOrder,
  setSortKey,
  setFilter,
  actualFilterData,
  filterCategories,
}: ConfigModalProps<T>) => {
  return (
    <Modal isVisible={isModalVisible} onClose={() => setisModalVisible(false)}>
      <View className="flex gap-4">
        <FilterSection<T> actualFilterData={actualFilterData} setFilter={setFilter} filterCategories={filterCategories} />
        <SortOrderSection actualSortOrder={actualSortOrder} setSortOrder={setSortOrder} />
        <SortKeySection actualSortKey={actualSortKey} setSortKey={setSortKey} withoutDate={withoutDate} />
        <Button label="Close" onPress={() => setisModalVisible(false)} className="mx-auto px-6" />
      </View>
    </Modal>
  );
};

export default ConfigModal;
