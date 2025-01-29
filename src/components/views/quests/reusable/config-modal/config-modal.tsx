import { QuestType, QuestKeyType, IFilterMapValues } from '../../constants/quest-constants';
import FilterSection from './elements/filter-section';
import SortKeySection from './elements/sort-key-section';
import SortOrderSection from './elements/sort-order-section';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { ActualFilterData, FilterValueType } from '@/hooks/use-filter';
import { SortOrderEnumType } from '@/hooks/use-sort';

interface ConfigModalProps<T extends QuestType> {
  isModalVisible: boolean;
  actualSortOrder: SortOrderEnumType;
  actualFilterData: ActualFilterData;
  actualSortKey: string | null;
  wihoutDate?: boolean;
  filtersMap: Map<string, IFilterMapValues<T>>;
  setisModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: (key: QuestKeyType<T>, value: FilterValueType) => void;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrderEnumType) => void;
}

const ConfigModal = <T extends QuestType>({
  isModalVisible,
  actualFilterData,
  actualSortKey,
  actualSortOrder,
  wihoutDate,
  filtersMap,
  setisModalVisible,
  setSortOrder,
  setSortKey,
  setFilter,
}: ConfigModalProps<T>) => {
  return (
    <Modal isVisible={isModalVisible} onClose={() => setisModalVisible(false)} className="flex gap-6">
      <FilterSection<T> actualFilterData={actualFilterData} setFilter={setFilter} filtersMap={filtersMap} />
      <SortOrderSection actualSortOrder={actualSortOrder} setSortOrder={setSortOrder} />
      <SortKeySection actualSortKey={actualSortKey} setSortKey={setSortKey} withoutDate={wihoutDate} />
      <Button label="Close" onPress={() => setisModalVisible(false)} className="mx-auto px-6 mt-4" />
    </Modal>
  );
};

export default ConfigModal;
