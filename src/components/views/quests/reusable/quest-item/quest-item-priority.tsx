import React from 'react';
import { Text, View } from 'react-native';
import { PriorityEnum, PriorityEnumType } from '@/contract/quests/base-quests';

interface QuestItemPriorityProps {
  priority: PriorityEnumType | null;
}

const priorityMeta = {
  [PriorityEnum.HIGH]: { label: 'High', color: 'text-red-500', icon: '🔥' },
  [PriorityEnum.MEDIUM]: { label: 'Medium', color: 'text-yellow-500', icon: '⚡' },
  [PriorityEnum.LOW]: { label: 'Low', color: 'text-green-500', icon: '🧘' },
};

const QuestItemPriority: React.FC<QuestItemPriorityProps> = ({ priority }) => {
  if (!priority) return null;

  const meta = priorityMeta[priority];

  return (
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-bold ${meta.color}`}>
        {meta.icon} {meta.label}
      </Text>
    </View>
  );
};

export default QuestItemPriority;
