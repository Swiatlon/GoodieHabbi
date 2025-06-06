import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import SortModal, { SortOption } from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import Header from '@/components/views/quests/reusable/header';
import TagItem from '@/components/views/quests/tags/list/tag-item';
import AddTagModal from '@/components/views/quests/tags/tag-modals/add-tag-modal';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useSearch } from '@/hooks/use-search/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort/use-sort';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';

const defaultSortOptions: SortOption[] = [
  { key: 'title', objKey: 'value', icon: <Ionicons name="text-outline" size={28} />, label: 'Title', color: '#000000' },
];

const Tags: React.FC = () => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isAddTagModalVisible, setIsAddTagModalVisible] = useState(false);
  const { data: questLabels = [], isLoading } = useGetQuestLabelsQuery();
  const buttonsStyle = useTransformFade({ isContentLoading: isLoading, delay: 200 });

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: questLabels,
  });

  const {
    data: sortedData,
    actualSortKey,
    actualSortOrder,
    setSortOrder,
    setSortKey,
    setSortObjKey,
  } = useSort({
    secureStorageName: 'SortTags',
    data: searchedData,
    initialSort: {
      key: 'title',
      objKey: 'value',
      order: SortOrderEnum.ASC,
    },
  });

  if (isLoading) {
    return <Loader message="Fetching tags..." />;
  }

  return (
    <>
      <View className="flex-1 p-4">
        <Header
          title="Quest tags"
          isSearchVisible={isSearchVisible}
          searchQuery={searchQuery}
          setIsSearchVisible={setIsSearchVisible}
          setSearchQuery={setSearchQuery}
          setIsSortModalVisible={setIsSortModalVisible}
        />

        <FlatList
          data={sortedData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TagItem tag={item} />}
          ListEmptyComponent={<Text className="text-center text-gray-500">No tags found.</Text>}
        />

        <Animated.View style={buttonsStyle}>
          <Button
            label="Add new Tag"
            onPress={() => setIsAddTagModalVisible(true)}
            startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
            className="mx-auto mt-4"
          />
        </Animated.View>

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
          sortOptions={defaultSortOptions}
        />

        {isAddTagModalVisible && <AddTagModal isVisible={isAddTagModalVisible} onClose={() => setIsAddTagModalVisible(false)} />}
      </View>
    </>
  );
};

export default Tags;
