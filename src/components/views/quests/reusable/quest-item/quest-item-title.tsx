import React from 'react';
import { View, Text } from 'react-native';

interface QuestItemTitleProps {
  title: string;
  description: string;
  completed: boolean;
}

const QuestItemTitle: React.FC<QuestItemTitleProps> = ({ title, description, completed }) => {
  return (
    <View className="flex pr-2">
      <View>
        <Text
          className={`text-lg ${completed ? 'line-through [text-decoration-thickness:3px] text-gray-500' : ''}`}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default QuestItemTitle;
