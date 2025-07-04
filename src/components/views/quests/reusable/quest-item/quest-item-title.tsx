import React from 'react';
import { View, Text } from 'react-native';

interface QuestItemTitleProps {
  title: string;
  isCompleted: boolean;
}

const QuestItemTitle: React.FC<QuestItemTitleProps> = ({ title, isCompleted }) => {
  return (
    <View className="flex pr-2">
      <Text className={`text-lg ${isCompleted ? 'line-through [text-decoration-thickness:3px] text-gray-500' : ''}`} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
};

export default QuestItemTitle;
