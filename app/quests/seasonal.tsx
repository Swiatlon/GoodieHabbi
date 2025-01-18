import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { QuestFilterMap } from '@/components/views/quests/constants/quest-constants';
import AddQuestModal from '@/components/views/quests/one-time/add-quest-modal/add-quest-modal';
import OneTimeQuestItem from '@/components/views/quests/one-time/list/one-time-quest-item';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import Header from '@/components/views/quests/reusable/header';
import { exampleSeasonalQuests, ISeasonalQuest } from '@/contract/quest';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort';

const SeasonalQuests: React.FC = () => {
  const [quests, setQuests] = useState<ISeasonalQuest[]>(exampleSeasonalQuests);
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
      value: QuestFilterMap.get('ALL')!.value,
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
        title="Seasonal Quests"
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
        className="py-3 mx-auto"
      />

      <ConfigModal<ISeasonalQuest>
        isModalVisible={isConfigModalVisible}
        actualFilterData={actualFilterData}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
      />

      <AddQuestModal isModalVisible={isAddQuestModalVisible} setIsModalVisible={setIsAddQuestModalVisible} />
    </View>
  );
};

export default SeasonalQuests;
