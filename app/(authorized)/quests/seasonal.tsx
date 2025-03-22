import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import ConfigModal from '@/components/views/quests/reusable/config-modal/config-modal';
import Header from '@/components/views/quests/reusable/header';
import { SeasonalQuestsFilterMap } from '@/components/views/quests/seasonal/constants/constants';
import SeasonalQuestItem from '@/components/views/quests/seasonal/list/seasonal-quest-item';
import AddSeasonalQuestModal from '@/components/views/quests/seasonal/quest-modals/add-seasonal-quest-modal';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort';
import { useGetAllSeasonalQuestsQuery } from '@/redux/api/seasonal-quests-api';

const SeasonalQuests: React.FC = () => {
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllSeasonalQuestsQuery();

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
  } = useFilter<ISeasonalQuest>({
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
        renderItem={({ item }) => <SeasonalQuestItem quest={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No quests found.</Text>}
      />

      <Button
        label="Add new Quest"
        onPress={() => setIsAddQuestModalVisible(true)}
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto mt-4"
      />

      <ConfigModal<ISeasonalQuest>
        isModalVisible={isConfigModalVisible}
        actualSortKey={actualSortKey}
        actualSortOrder={actualSortOrder}
        setisModalVisible={setIsConfigModalVisible}
        setSortOrder={setSortOrder}
        setSortKey={setSortKey}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        filterCategories={SeasonalQuestsFilterMap}
      />

      {isAddQuestModalVisible && <AddSeasonalQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />}
    </View>
  );
};

export default SeasonalQuests;
