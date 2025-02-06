import React from 'react';
import { View, Text } from 'react-native';

interface QuestItemTitleProps {
  title: string;
  description: string | null;
  isCompleted: boolean;
}

const QuestItemTitle: React.FC<QuestItemTitleProps> = ({ title, description, isCompleted }) => {
  return (
    <View className="flex pr-2">
      <View>
        <Text
          className={`text-lg ${isCompleted ? 'line-through [text-decoration-thickness:3px] text-gray-500' : ''}`}
          numberOfLines={2}
        >
          {title}
        </Text>
        {description && (
          <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

export default QuestItemTitle;
