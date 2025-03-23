import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Loader from '@/components/shared/loader/loader';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import Header from '@/components/views/quests/reusable/header';
import { TodayQuestsFilterMap } from '@/components/views/quests/today/constants/constants';
import TodayQuestItem from '@/components/views/quests/today/list/today-quest-item';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort';
import { useGetAllTodayQuestsQuery } from '@/redux/api/today-quests-api';

const TodayQuests: React.FC = () => {
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllTodayQuestsQuery();

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
        title="Today Quests"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setIsConfigModalVisible={setIsConfigModalVisible}
        setSearchQuery={setSearchQuery}
      />

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TodayQuestItem quest={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <ConfigModal<AllQuestsUnion>
        isModalVisible={isConfigModalVisible}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        filterCategories={TodayQuestsFilterMap}
      />
    </View>
  );
};

export default TodayQuests;
