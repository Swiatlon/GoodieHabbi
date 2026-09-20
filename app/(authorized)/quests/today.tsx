import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import CatchUpCard from '@/components/views/quests/catch-up/catch-up-card';
import { QuestFilterMap } from '@/components/views/quests/list/constants';
import QuestListItem from '@/components/views/quests/list/quest-list-item';
import AddQuestModal from '@/components/views/quests/quest-form/add-quest-modal';
import Header from '@/components/views/quests/reusable/header';
import { IQuest } from '@/contract/quests/quest.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useFilter } from '@/hooks/use-filter/use-filter';
import { useSearch } from '@/hooks/use-search/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort/use-sort';
import { useGetActiveQuestsQuery } from '@/redux/api/quests/quests-api';

/**
 * Today's quests. This screen also triggers the backend's daily housekeeping pass, so it stays the one
 * the app opens on — the API has no scheduler and relies on a read to materialise due periods.
 */
const TodayQuests: React.FC = () => {
  const { t } = useTranslation();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);

  const { data: fetchedQuests = [], isLoading } = useGetActiveQuestsQuery();

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
  } = useFilter<IQuest>({
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
    setSortObjKey,
  } = useSort({
    secureStorageName: 'SortTodayQuests',
    data: filteredQuests,
    initialSort: {
      key: 'title',
      objKey: 'title',
      order: SortOrderEnum.ASC,
    },
  });

  if (isLoading) {
    return <Loader message={t('quests.today.fetchingQuests')} />;
  }

  return (
    <View className="flex-1 p-4" testID="today-quests-screen">
      <Header
        title={t('quests.today.title')}
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
        /* The recurrence line is redundant here — everything on this screen is due today by definition. */
        renderItem={({ item }) => <QuestListItem quest={item} withSchedule={false} />}
        ListHeaderComponent={<CatchUpCard />}
        ListEmptyComponent={<Text className="text-center text-gray-500">{t('quests.today.noQuestsFound')}</Text>}
      />

      <Animated.View style={buttonsStyle}>
        <Button
          label={t('quests.today.addNewQuest')}
          onPress={() => setIsAddQuestModalVisible(true)}
          startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          className="mx-auto mt-4"
        />
      </Animated.View>

      <FilterModal<IQuest>
        isVisible={isFilterModalVisible}
        setIsVisible={setIsFilterModalVisible}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        filterCategories={QuestFilterMap}
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

      <AddQuestModal isVisible={isAddQuestModalVisible} onClose={handleCloseModal} />
    </View>
  );
};

export default TodayQuests;
