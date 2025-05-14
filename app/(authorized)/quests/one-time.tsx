import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import { OneTimeQuestsFilterMap } from '@/components/views/quests/one-time/constants/constants';
import OneTimeQuestItem from '@/components/views/quests/one-time/list/one-time-quest-item';
import AddOneTimeQuestModal from '@/components/views/quests/one-time/quest-modals/add-one-time-quest-modal';
import Header from '@/components/views/quests/reusable/header';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useFilter } from '@/hooks/use-filter/use-filter';
import { useSearch } from '@/hooks/use-search/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort/use-sort';
import { useGetAllOneTimeQuestsQuery } from '@/redux/api/one-time-quests-api';

const OneTimeQuests: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllOneTimeQuestsQuery();
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
  } = useFilter<IOneTimeQuest>({
    secureStorageName: 'FilterOneTimeQuests',
    data: searchedData,
    initialFilter: { isCompleted: false, priority: null },
  });

  const {
    data: sortedData,
    actualSortKey,
    actualSortOrder,
    setSortOrder,
    setSortKey,
    setSortObjKey,
  } = useSort({
    secureStorageName: 'SortOneTimeQuests',
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
    <View className="flex-1 p-4">
      <Header
        title="One Time Quests"
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
        renderItem={({ item }) => <OneTimeQuestItem quest={item} />}
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

      <FilterModal<IOneTimeQuest>
        isVisible={isFilterModalVisible}
        setIsVisible={setIsFilterModalVisible}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        filterCategories={OneTimeQuestsFilterMap}
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

      {isAddQuestModalVisible && <AddOneTimeQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />}
    </View>
  );
};

export default OneTimeQuests;
