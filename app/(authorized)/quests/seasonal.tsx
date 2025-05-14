import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import Header from '@/components/views/quests/reusable/header';
import { SeasonalQuestsFilterMap } from '@/components/views/quests/seasonal/constants/constants';
import SeasonalQuestItem from '@/components/views/quests/seasonal/list/seasonal-quest-item';
import AddSeasonalQuestModal from '@/components/views/quests/seasonal/quest-modals/add-seasonal-quest-modal';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useFilter } from '@/hooks/use-filter';
import { useSearch } from '@/hooks/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort';
import { useGetAllSeasonalQuestsQuery } from '@/redux/api/seasonal-quests-api';

const SeasonalQuests: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const { data: fetchedQuests = [], isLoading } = useGetAllSeasonalQuestsQuery();
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
  } = useFilter<ISeasonalQuest>({
    secureStorageName: 'FilterSeasonalQuests',
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
    secureStorageName: 'SortSeasonalQuests',
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
      <View className="flex-1 p-4">
        <Header
          title="Seasonal Quests"
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
          renderItem={({ item }) => <SeasonalQuestItem quest={item} />}
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

        <FilterModal<ISeasonalQuest>
          isVisible={isFilterModalVisible}
          setIsVisible={setIsFilterModalVisible}
          setFilter={setFilter}
          actualFilterData={actualFilter}
          filterCategories={SeasonalQuestsFilterMap}
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

        {isAddQuestModalVisible && <AddSeasonalQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />}
      </View>
    </>
  );
};

export default SeasonalQuests;
