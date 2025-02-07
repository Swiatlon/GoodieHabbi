import React from 'react';
import { View } from 'react-native';

interface QuestItemContainerProps {
  children: React.ReactNode;
  completed: boolean;
}

const QuestItemContainer: React.FC<QuestItemContainerProps> = ({ children, completed }) => {
  return (
    <View className={`flex flex-row items-center justify-between py-5 px-4 border-b border-gray-300 ${completed ? 'bg-gray-100' : ''}`}>
      {children}
    </View>
  );
};

export default QuestItemContainer;
