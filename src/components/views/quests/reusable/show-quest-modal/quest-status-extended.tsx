import React from 'react';
import { View, Text } from 'react-native';

interface QuestStatusExtendedProps {
  isCompleted: boolean;
}

const QuestStatusExtended: React.FC<QuestStatusExtendedProps> = ({ isCompleted }) => {
  const emoji = isCompleted ? '✅' : '⏳';
  const title = isCompleted ? 'Completed' : 'In Progress';
  const titleColor = isCompleted ? 'text-green-600' : 'text-yellow-600';
  const description = isCompleted ? 'Well done! This quest has been completed.' : 'This quest is currently active. Keep pushing toward completion!';

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-start gap-4">
      <Text className={`text-2xl my-auto`}>{emoji}</Text>
      <View className="flex-1">
        <Text className={`text-md font-semibold ${titleColor}`}>{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
    </View>
  );
};

export default QuestStatusExtended;
