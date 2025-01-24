import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import AddDailyQuestModal from '@/components/views/quests/daily/add-quest-modal/add-daily-quest-modal';
import { DailyQuestFilterMap } from '@/components/views/quests/daily/constants/constants';
import OneTimeQuestItem from '@/components/views/quests/one-time/list/one-time-quest-item';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import Header from '@/components/views/quests/reusable/header';
import { exampleDailyQuests, IDailyQuests, IOneTimeQuest } from '@/contract/quest';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort';

const DailyQuests: React.FC = () => {
  const [quests, setQuests] = useState<IOneTimeQuest[]>(exampleDailyQuests);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: quests,
    initialSearch: {
      key: 'title',
      value: '',
    },
  });

  const {
    data: filteredQuests,
    actualFilterData,
    setFilter,
  } = useFilter({
    data: searchedData,
    initialFilter: {
      key: 'completed',
      value: DailyQuestFilterMap.get('ALL')!.value,
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

  return (
    <View className="flex-1 p-4">
      <Header
        title="Daily Quests"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setIsConfigModalVisible={setIsConfigModalVisible}
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <OneTimeQuestItem quest={item} setQuests={setQuests} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <Button
        label="Add new Quest"
        onPress={() => setIsAddQuestModalVisible(true)}
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto py-2 mt-4"
      />

      <ConfigModal<IDailyQuests>
        isModalVisible={isConfigModalVisible}
        actualFilterData={actualFilterData}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        filtersMap={DailyQuestFilterMap}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
        wihoutDate
      />

      <AddDailyQuestModal isModalVisible={isAddQuestModalVisible} setIsModalVisible={setIsAddQuestModalVisible} />
    </View>
  );
};

export default DailyQuests;
