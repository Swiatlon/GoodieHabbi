import React from 'react';
import { Text } from 'react-native';
import { PriorityEnum, PriorityEnumType } from '@/contract/quest';

interface QuestItemPriorityProps {
  priority: PriorityEnumType | null;
}

const getPriorityStyle = (priority: PriorityEnumType) => {
  switch (priority) {
    case PriorityEnum.HIGH:
      return 'text-red-500';
    case PriorityEnum.MEDIUM:
      return 'text-yellow-500';
    case PriorityEnum.LOW:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

const QuestItemPriority: React.FC<QuestItemPriorityProps> = ({ priority }) => {
  if (!priority) {
    return null;
  }

  return (
    <Text className={`text-sm font-bold ${getPriorityStyle(priority)}`}>
      Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Text>
  );
};

export default QuestItemPriority;
