import { QuestType, QuestKeyType } from '../../constants/quest-constants';
import FilterSection from './elements/filter-section';
import SortKeySection from './elements/sort-key-section';
import SortOrderSection from './elements/sort-order-section';
import Button from '@/components/shared/button/button';
import Modal from '@/components/shared/modal/modal';
import { ActualFilterData, FilterValueType } from '@/hooks/use-filter';
import { SortOrderEnum } from '@/hooks/use-sort';

interface ConfigModalProps<T extends QuestType> {
  isModalVisible: boolean;
  actualSortOrder: SortOrderEnum;
  actualFilterData: ActualFilterData;
  actualSortKey: string | null;
  isDailyModal?: boolean;
  setisModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: (key: QuestKeyType<T>, value: FilterValueType) => void;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrderEnum) => void;
}

const ConfigModal = <T extends QuestType>({
  isModalVisible,
  actualFilterData,
  actualSortKey,
  actualSortOrder,
  isDailyModal,
  setisModalVisible,
  setSortOrder,
  setSortKey,
  setFilter,
}: ConfigModalProps<T>) => {
  return (
    <Modal isVisible={isModalVisible} onClose={() => setisModalVisible(false)} className="flex gap-6">
      <FilterSection<T> actualFilterData={actualFilterData} setFilter={setFilter} />
      <SortOrderSection actualSortOrder={actualSortOrder} setSortOrder={setSortOrder} />
      <SortKeySection actualSortKey={actualSortKey} setSortKey={setSortKey} withoutDate={isDailyModal} />
      <Button label="Close" onPress={() => setisModalVisible(false)} className="mx-auto px-6" />
    </Modal>
  );
};

export default ConfigModal;
