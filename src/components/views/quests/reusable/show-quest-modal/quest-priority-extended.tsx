import React from 'react';
import { View, Text } from 'react-native';
import { PriorityEnum, PriorityEnumType } from '@/contract/quests/base-quests';

interface QuestPriorityExtendedProps {
  priority?: PriorityEnumType | null;
}

const priorityMeta = {
  [PriorityEnum.HIGH]: {
    label: 'High',
    icon: '🔥',
    colorClass: 'text-red-500',
    description: 'Requires immediate attention',
  },
  [PriorityEnum.MEDIUM]: {
    label: 'Medium',
    icon: '⚡',
    colorClass: 'text-yellow-500',
    description: 'Moderate importance',
  },
  [PriorityEnum.LOW]: {
    label: 'Low',
    icon: '🧘',
    colorClass: 'text-green-500',
    description: 'Low priority, can wait',
  },
};

const QuestPriorityExtended: React.FC<QuestPriorityExtendedProps> = ({ priority }) => {
  if (!priority) return null;

  const meta = priorityMeta[priority];

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className={`${meta.colorClass} text-2xl my-auto`}>{meta.icon}</Text>
      <View>
        <Text className={`${meta.colorClass} font-semibold text-base`}>Priority: {meta.label}</Text>
        <Text className="text-gray-500 text-xs">{meta.description}</Text>
      </View>
    </View>
  );
};

export default QuestPriorityExtended;
