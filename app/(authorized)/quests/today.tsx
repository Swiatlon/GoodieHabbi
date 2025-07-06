import React, { useState } from 'react';
import { View, FlatList, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import AddAllQuestModal from '@/components/views/quests/all/quest-modals/add-all-quest-modal';
import Header from '@/components/views/quests/reusable/header';
import { TodayQuestsFilterMap } from '@/components/views/quests/today/constants/constants';
import TodayQuestItem from '@/components/views/quests/today/list/today-quest-item';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';
import { useFilter } from '@/hooks/use-filter/use-filter';
import { useSearch } from '@/hooks/use-search/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort/use-sort';
import { useGetAllTodayQuestsQuery } from '@/redux/api/quests/today-quests-api';

const TodayQuests: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);

  const { data: fetchedQuests = [], isLoading } = useGetAllTodayQuestsQuery();

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
  } = useFilter<AllQuestsUnion>({
    secureStorageName: 'FilterTodayQuests',
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
    secureStorageName: 'SortTodayQuests',
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
      <View className="flex-1 p-4" testID="today-quests-screen">
        <Header
          title="Today Quests"
          isSearchVisible={isSearchVisible}
          searchQuery={searchQuery}
          setIsSearchVisible={setIsSearchVisible}
          setSearchQuery={setSearchQuery}
          setIsFilterModalVisible={setIsFilterModalVisible}
          setIsSortModalVisible={setIsSortModalVisible}
        />

        <FlatList
          data={sortedData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TodayQuestItem quest={item} />}
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

        <FilterModal<AllQuestsUnion>
          isVisible={isFilterModalVisible}
          setIsVisible={setIsFilterModalVisible}
          setFilter={setFilter}
          actualFilterData={actualFilter}
          filterCategories={TodayQuestsFilterMap}
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

        <AddAllQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />
      </View>
    </>
  );
};

export default TodayQuests;
