import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import { MonthlyQuestsFilterMap } from '@/components/views/quests/monthly/constants/constants';
import MonthlyQuestItem from '@/components/views/quests/monthly/list/monthly-quest-item';
import AddMonthlyQuestModal from '@/components/views/quests/monthly/quest-modals/add-monthly-quest-modal';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import Header from '@/components/views/quests/reusable/header';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort';
import { useGetAllMonthlyQuestsQuery } from '@/redux/api/monthly-quests-api';

const MonthlyQuests: React.FC = () => {
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllMonthlyQuestsQuery();

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
  } = useFilter<IMonthlyQuest>({
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
        title="Monthly Quests"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setIsConfigModalVisible={setIsConfigModalVisible}
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <MonthlyQuestItem quest={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <Button
        label="Add new Quest"
        onPress={() => setIsAddQuestModalVisible(true)}
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto py-2 mt-4"
      />

      <ConfigModal<IMonthlyQuest>
        isModalVisible={isConfigModalVisible}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        filterCategories={MonthlyQuestsFilterMap}
      />

      <AddMonthlyQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />
    </View>
  );
};

export default MonthlyQuests;
