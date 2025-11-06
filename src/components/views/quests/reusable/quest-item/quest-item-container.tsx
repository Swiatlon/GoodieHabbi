import React from 'react';
import Animated from 'react-native-reanimated';

interface QuestItemContainerProps {
  children: React.ReactNode;
  completed: boolean;
  withoutDivider?: boolean;
  style?: object;
}

const QuestItemContainer: React.FC<QuestItemContainerProps> = ({ children, completed, withoutDivider, style }) => {
  return (
    <Animated.View
      testID="quest-item-container"
      className={`flex flex-row items-center justify-between p-5 ${withoutDivider ? '' : 'border-b'} border-gray-300 ${completed ? 'bg-gray-100' : ''}`}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export default QuestItemContainer;
