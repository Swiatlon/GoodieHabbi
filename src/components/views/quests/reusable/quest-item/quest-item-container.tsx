import React from 'react';
import { View } from 'react-native';

interface QuestItemContainerProps {
  children: React.ReactNode;
  completed: boolean;
  withoutDivider?: boolean;
}

const QuestItemContainer: React.FC<QuestItemContainerProps> = ({ children, completed, withoutDivider }) => {
  return (
    <View
      className={`flex flex-row items-center justify-between p-5 ${withoutDivider ? '' : 'border-b'} border-gray-300 ${completed ? 'bg-gray-100' : ''}`}
    >
      {children}
    </View>
  );
};

export default QuestItemContainer;
