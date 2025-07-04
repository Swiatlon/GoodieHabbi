import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';
import { getBestContrastTextColor } from '@/utils/utils/utils';

interface QuestItemTagProps {
  tags: IQuestLabel[];
  onPress?: () => void;
}

const QuestItemTag: React.FC<QuestItemTagProps> = ({ tags, onPress }) => {
  if (tags.length === 0) {
    return null;
  }

  const [isScrolling, setIsScrolling] = useState(false);

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    setIsScrolling(false);
  };

  return (
    <ScrollView
      className="max-h-[50px] flex-row flex-nowrap"
      horizontal={false}
      onScrollBeginDrag={handleScrollBegin}
      onScrollEndDrag={handleScrollEnd}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={isScrolling ? 1 : 0.7}>
        <View className="flex-row flex-nowrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <View
              key={index}
              className="flex-row items-center my-1 py-2 px-2 rounded-3xl shadow-lg mr-auto"
              style={{ backgroundColor: tag.backgroundColor }}
            >
              <Ionicons name="pricetag-outline" size={12} color={getBestContrastTextColor(tag.backgroundColor)} className="mr-1" />
              <Text
                className="text-[10px] font-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: getBestContrastTextColor(tag.backgroundColor) }}
              >
                {tag.value}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuestItemTag;
