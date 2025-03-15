import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import Header from '@/components/views/quests/reusable/header';
import TagItem from '@/components/views/quests/tags/list/tag-item';
import AddTagModal from '@/components/views/quests/tags/tag-modals/add-tag-modal';
import { useSearch } from '@/hooks/use-search';
import { useGetQuestLabelsQuery } from '@/redux/api/quests/labels-quests-api';

const Tags: React.FC = () => {
  const [isAddTagModalVisible, setIsAddTagModalVisible] = useState(false);
  const { data: questLabels = [], isLoading } = useGetQuestLabelsQuery();

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: questLabels,
    initialSearch: {
      key: 'value',
      value: '',
    },
  });

  if (isLoading) {
    return <Loader message="Fetching quests..." />;
  }

  return (
    <View className="flex-1 p-4">
      <Header
        title="Quest tags"
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setSearchQuery={setSearchQuery}
      />
      <FlatList
        data={searchedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TagItem tag={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500">No tags found.</Text>}
      />

      <Button
        label="Add new tag"
        onPress={() => setIsAddTagModalVisible(true)}
        startIcon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
        className="mx-auto mt-4"
      />

      {isAddTagModalVisible && <AddTagModal isVisible={isAddTagModalVisible} onClose={() => setIsAddTagModalVisible(false)} />}
    </View>
  );
};

export default Tags;
