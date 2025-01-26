import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import { OneTimeQuestsFilterMap } from '@/components/views/quests/one-time/constants/constants';
import AddRepeatableQuestModal from '@/components/views/quests/repeatable/add-quest-modal/elements/add-repeatable-quest-modal';
import RepatableQuestItem from '@/components/views/quests/repeatable/list/repeatable-quest-item';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import Header from '@/components/views/quests/reusable/header';
import { exampleRepeatableQuests, IRepeatableQuest } from '@/contract/quest';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort';

const RepeatableQuests: React.FC = () => {
  const [quests, setQuests] = useState<IRepeatableQuest[]>(exampleRepeatableQuests);
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
      value: OneTimeQuestsFilterMap.get('ALL')!.value,
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
        title="Repeatable Quests"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setIsConfigModalVisible={setIsConfigModalVisible}
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <RepatableQuestItem quest={item} setQuests={setQuests} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <Button
        label="Add new Quest"
        onPress={() => setIsAddQuestModalVisible(true)}
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto py-2 mt-4"
      />

      <ConfigModal<IRepeatableQuest>
        isModalVisible={isConfigModalVisible}
        actualFilterData={actualFilterData}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        filtersMap={OneTimeQuestsFilterMap}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
      />

      <AddRepeatableQuestModal isModalVisible={isAddQuestModalVisible} setIsModalVisible={setIsAddQuestModalVisible} />
    </View>
  );
};

export default RepeatableQuests;
