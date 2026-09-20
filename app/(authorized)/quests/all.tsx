import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import FilterChips from '@/components/shared/filter-chips/filter-chips';
import Loader from '@/components/shared/loader/loader';
import { QUEST_SCOPE_FILTERS, QuestFilterMap, QuestScopeEnumType } from '@/components/views/quests/list/constants';
import QuestListItem from '@/components/views/quests/list/quest-list-item';
import AddQuestModal from '@/components/views/quests/quest-form/add-quest-modal';
import Header from '@/components/views/quests/reusable/header';
import { IQuest } from '@/contract/quests/quest.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useFilter } from '@/hooks/use-filter/use-filter';
import { useSearch } from '@/hooks/use-search/use-search';
import { useSort, SortOrderEnum } from '@/hooks/use-sort/use-sort';
import { useGetQuestsQuery } from '@/redux/api/quests/quests-api';

/**
 * Every quest on one screen, which is what replaced the five per-type lists.
 *
 * The scope chips filter client-side on purpose: the list is small, one request covers every chip, and
 * combinations the old drawer tree could not express — "weekly" plus a search term plus a sort — come
 * out for free. The API's `?unit=` filter exists but would cost a round trip per chip to do less.
 */
const AllQuests: React.FC = () => {
  const { t } = useTranslation();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState(false);
  const [scope, setScope] = useState<QuestScopeEnumType | null>(null);

  const { data: fetchedQuests = [], isLoading } = useGetQuestsQuery();

  const buttonsStyle = useTransformFade({ isContentLoading: isLoading, delay: 200 });

  const scopedQuests = useMemo(() => {
    const activeScope = QUEST_SCOPE_FILTERS.find(item => item.key === scope);

    return activeScope ? fetchedQuests.filter(activeScope.matches) : fetchedQuests;
  }, [fetchedQuests, scope]);

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: scopedQuests,
  });

  const {
    data: filteredQuests,
    setFilter,
    actualFilter,
  } = useFilter<IQuest>({
    secureStorageName: 'FilterAllQuests',
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
    setSortObjKey,
  } = useSort({
    secureStorageName: 'SortAllQuests',
    data: filteredQuests,
    initialSort: {
      key: 'title',
      objKey: 'title',
      order: SortOrderEnum.ASC,
    },
  });

  if (isLoading) {
    return <Loader message={t('quests.all.fetchingQuests')} />;
  }

  return (
    <View className="flex-1 p-4" testID="all-quests-screen">
      <Header
        title={t('quests.all.title')}
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setSearchQuery={setSearchQuery}
        setIsFilterModalVisible={setIsFilterModalVisible}
        setIsSortModalVisible={setIsSortModalVisible}
      />

      <View className="mb-3">
        <FilterChips<QuestScopeEnumType>
          items={QUEST_SCOPE_FILTERS.map(item => ({ key: item.key, label: t(item.labelKey), emoji: item.emoji }))}
          value={scope}
          onChange={setScope}
          allLabel={t('quests.all.scopes.all')}
          testID="quest-scope-chips"
        />
      </View>

      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <QuestListItem quest={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">{t('quests.all.noQuestsFound')}</Text>}
      />

      <Animated.View style={buttonsStyle}>
        <Button
          label={t('quests.all.addNewQuest')}
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

      <AddQuestModal isVisible={isAddQuestModalVisible} onClose={() => setIsAddQuestModalVisible(false)} />
    </View>
  );
};

export default AllQuests;
