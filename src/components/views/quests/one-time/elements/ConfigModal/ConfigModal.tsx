import React from 'react';
import { Quest } from '../../constants/QuestsConstants';
import FilterSection from './elements/FilterSection';
import SortKeySection from './elements/SortKeySection';
import SortOrderSection from './elements/SortOrderSection';
import Button from '@/components/shared/button/Button';
import Modal from '@/components/shared/modal/Modal';
import { ActualFilterData, FilterValueType } from '@/hooks/useFilter';
import { SortOrderEnum } from '@/hooks/useSort';

interface ConfigModalProps {
  isModalVisible: boolean;
  actualSortOrder: SortOrderEnum;
  actualFilterData: ActualFilterData;
  actualSortKey: string | null;
  setisModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: (key: keyof Quest, value: FilterValueType) => void;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrderEnum) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isModalVisible,
  actualFilterData,
  actualSortKey,
  actualSortOrder,
  setisModalVisible,
  setSortOrder,
  setSortKey,
  setFilter,
}) => {
  return (
    <Modal isVisible={isModalVisible} onClose={() => setisModalVisible(false)}>
      <FilterSection actualFilterData={actualFilterData} setFilter={setFilter} />
      <SortOrderSection actualSortOrder={actualSortOrder} setSortOrder={setSortOrder} />
      <SortKeySection actualSortKey={actualSortKey} setSortKey={setSortKey} />
      <Button label="Close" onPress={() => setisModalVisible(false)} className="mx-auto mt-4 px-6" />
    </Modal>
  );
};

export default ConfigModal;
