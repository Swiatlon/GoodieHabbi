import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { IQuestLabel } from '@/contract/quests/labels/labels-quests';
import { getBestContrastTextColor } from '@/utils/utils/utils';

interface QuestTagsExtendedProps {
  tags?: IQuestLabel[];
}

const QuestTagsExtended: React.FC<QuestTagsExtendedProps> = ({ tags = [] }) => {
  if (tags.length === 0) return null;

  return (
    <View className="bg-white rounded-md p-4 border border-gray-200 shadow-sm max-h-64">
      <View className="flex-row items-center gap-3 mb-4">
        <Text className="text-xl">🏷️</Text>
        <Text className="text-lg font-semibold text-gray-700">Quest Tags:</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} horizontal={false} className="max-h-[50px] flex-row flex-nowrap">
        <View className="flex-row gap-2 mb-2 flex-wrap">
          {tags.map(tag => (
            <View
              key={tag.id}
              className="flex-row items-center my-1 py-2 px-3 rounded-3xl shadow-lg"
              style={{ backgroundColor: tag.backgroundColor }}
            >
              <Text className="mr-1 text-xs font-medium" style={{ color: getBestContrastTextColor(tag.backgroundColor) }}>
                🏷️
              </Text>
              <Text
                className="text-xs font-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: getBestContrastTextColor(tag.backgroundColor) }}
              >
                {tag.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default QuestTagsExtended;
