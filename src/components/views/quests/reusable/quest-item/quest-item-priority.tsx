import React from 'react';
import { Text } from 'react-native';

interface QuestItemPriorityProps {
  priority?: 'low' | 'medium' | 'high';
}

const QuestItemPriority: React.FC<QuestItemPriorityProps> = ({ priority }) => {
  if (!priority) return null;

  const getPriorityStyle = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Text className={`text-sm font-bold ${getPriorityStyle(priority)}`}>
      Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Text>
  );
};

export default QuestItemPriority;
