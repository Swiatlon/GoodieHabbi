import React from 'react';
import { View, Text } from 'react-native';

interface QuestTitleSectionProps {
  title: string;
  emoji: string | null;
}

const QuestTitleExtended: React.FC<QuestTitleSectionProps> = ({ title, emoji }) => (
  <View className="bg-white rounded-md shadow-sm flex-row justify-center items-center gap-3">
    <Text className="text-2xl font-extrabold flex-1 text-center">
      {emoji} {title}
    </Text>
  </View>
);

export default QuestTitleExtended;
