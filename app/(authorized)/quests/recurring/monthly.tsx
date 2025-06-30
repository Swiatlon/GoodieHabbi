import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import { MonthlyQuestsFilterMap } from '@/components/views/quests/monthly/constants/constants';
import MonthlyQuestItem from '@/components/views/quests/monthly/list/monthly-quest-item';
import AddMonthlyQuestModal from '@/components/views/quests/monthly/quest-modals/add-monthly-quest-modal';
import Header from '@/components/views/quests/reusable/header';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useFilter } from '@/hooks/use-filter/use-filter';
import { useSearch } from '@/hooks/use-search/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort/use-sort';
import { useGetAllMonthlyQuestsQuery } from '@/redux/api/quests/monthly-quests-api';

const MonthlyQuests: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllMonthlyQuestsQuery();
  const buttonsStyle = useTransformFade({ isContentLoading: isLoading, delay: 200 });

  const handleCloseModal = () => setIsAddQuestModalVisible(false);

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: fetchedQuests,
  });

  const {
    data: filteredQuests,
    setFilter,
    actualFilter,
  } = useFilter<IMonthlyQuest>({
    secureStorageName: 'FilterMonthlyQuests',
    data: searchedData,
    initialFilter: {
      isCompleted: false,
      priority: null,
    },
  });

  const {
    data: sortedData,
    actualSortKey,
    actualSortOrder,
    setSortOrder,
    setSortKey,
    setSortObjKey,
  } = useSort({
    secureStorageName: 'SortMonthlyQuests',
    data: filteredQuests,
    initialSort: {
      key: 'title',
      objKey: 'title',
      order: SortOrderEnum.ASC,
    },
  });

  if (isLoading) {
    return <Loader message="Fetching quests..." />;
  }

  return (
    <>
      <View className="flex-1 p-4">
        <Header
          title="Monthly Quests"
          isSearchVisible={isSearchVisible}
          searchQuery={searchQuery}
          setIsSearchVisible={setIsSearchVisible}
          setIsFilterModalVisible={setIsFilterModalVisible}
          setIsSortModalVisible={setIsSortModalVisible}
          setSearchQuery={setSearchQuery}
        />

        <FlatList
          data={sortedData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <MonthlyQuestItem quest={item} />}
          ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
        />

        <Animated.View style={buttonsStyle}>
          <Button
            label="Add new Quest"
            onPress={() => setIsAddQuestModalVisible(true)}
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
            className="mx-auto mt-4"
          />
        </Animated.View>

        <FilterModal<IMonthlyQuest>
          isVisible={isFilterModalVisible}
          setIsVisible={setIsFilterModalVisible}
          setFilter={setFilter}
          actualFilterData={actualFilter}
          filterCategories={MonthlyQuestsFilterMap}
        />

        <SortModal
          isVisible={isSortModalVisible}
          setIsVisible={setIsSortModalVisible}
          actualSortKey={actualSortKey}
          setActualSortKeys={(key, objKey) => {
            setSortKey(key);
            setSortObjKey(objKey);
          }}
          actualSortOrder={actualSortOrder}
          setSortOrder={setSortOrder}
        />

        {isAddQuestModalVisible && <AddMonthlyQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />}
      </View>
    </>
  );
};

export default MonthlyQuests;
