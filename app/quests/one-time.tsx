import React, { useState } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exampleQuests, Quest, QuestFilterMap } from '@/components/views/quests/one-time/constants/QuestsConstants';
import AddQuestModal from '@/components/views/quests/one-time/elements/AddQuestModal/AddQuestModal';
import ConfigModal from '@/components/views/quests/one-time/elements/ConfigModal/ConfigModal';
import Header from '@/components/views/quests/one-time/elements/ListElements/Header';
import QuestItem from '@/components/views/quests/one-time/elements/ListElements/QuestItem';
import { useFilter } from '@/hooks/useFilter';
import { useSearch } from '@/hooks/useSearch';
import { SortOrderEnum, useSort } from '@/hooks/useSort';

const OneTimeQuests: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(exampleQuests);
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
    actualFilterValue,
    setFilter,
  } = useFilter({
    data: searchedData,
    initialFilter: {
      key: 'completed',
      value: QuestFilterMap.get('ALL')!,
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
        title="One Time Quests"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setIsConfigModalVisible={setIsConfigModalVisible}
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <QuestItem quest={item} setQuests={setQuests} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-full shadow-lg flex-row items-center w-max self-center mt-4"
        onPress={() => setIsAddQuestModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text className="text-white ml-2 font-semibold">Add New Quest</Text>
      </TouchableOpacity>

      <ConfigModal
        isModalVisible={isConfigModalVisible}
        actualFilterValue={actualFilterValue}
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

export default OneTimeQuests;
