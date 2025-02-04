import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import { WeeklyQuestFilterMap } from '@/components/views/quests/weekly/constants/constants';
import WeeklyQuestItem from '@/components/views/quests/weekly/list/weekly-quest-item';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort';
import { useGetAllWeeklyQuestsQuery } from '@/redux/api/weekly-quests-api';
import Header from '@/components/views/quests/reusable/header';

const WeeklyQuests: React.FC = () => {
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllWeeklyQuestsQuery();

  const handleCloseModal = () => setIsAddQuestModalVisible(false);

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: fetchedQuests,
    initialSearch: {
      key: 'title',
      value: '',
    },
  });

  const {
    data: filteredQuests,
    setFilter,
    actualFilter,
  } = useFilter<IWeeklyQuest>({
    data: searchedData,
    initialFilter: {
      isCompleted: null,
      priority: null,
    },
  });

  const {
    data: sortedData,
    actualSortKey,
    actualSortOrder,
    setSortOrder,
    setSortKey,
  } = useSort({
    data: filteredQuests,
    initialSort: {
      key: 'title',
      order: SortOrderEnum.ASC,
    },
  });

  if (isLoading) {
    return <Loader message="Fetching quests..." />;
  }

  return (
    <View className="flex-1 p-4">
      <Header
        title="Weekly Quests"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setIsConfigModalVisible={setIsConfigModalVisible}
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <WeeklyQuestItem quest={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <Button
        label="Add new Quest"
        onPress={() => setIsAddQuestModalVisible(true)}
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto py-2 mt-4"
      />

      <ConfigModal<IWeeklyQuest>
        isModalVisible={isConfigModalVisible}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        filterCategories={WeeklyQuestFilterMap}
      />

      {/* <AddWeeklyQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} /> */}
    </View>
  );
};

export default WeeklyQuests;
