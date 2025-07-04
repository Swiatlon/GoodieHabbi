import React from 'react';
import { View, Text } from 'react-native';
import { DifficultyEnum, DifficultyEnumType } from '@/contract/quests/base-quests';

interface QuestDifficultyExtendedProps {
  difficulty?: DifficultyEnumType | null;
}

const difficultyMeta = {
  [DifficultyEnum.EASY]: {
    label: 'Easy',
    icon: '🍃',
    colorClass: 'text-green-500',
    description: 'Low effort, beginner friendly',
  },
  [DifficultyEnum.MEDIUM]: {
    label: 'Medium',
    icon: '🧗‍♂️',
    colorClass: 'text-yellow-500',
    description: 'Moderate challenge',
  },
  [DifficultyEnum.HARD]: {
    label: 'Hard',
    icon: '💀',
    colorClass: 'text-red-500',
    description: 'High difficulty, advanced level',
  },
  [DifficultyEnum.IMPOSSIBLE]: {
    label: 'Impossible',
    icon: '☠️',
    colorClass: 'text-red-500 font-extrabold',
    description: 'Near impossible, extreme challenge',
  },
};

const QuestDifficultyExtended: React.FC<QuestDifficultyExtendedProps> = ({ difficulty }) => {
  if (!difficulty) return null;

  const meta = difficultyMeta[difficulty];

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className={`${meta.colorClass} text-2xl my-auto`}>{meta.icon}</Text>
      <View>
        <Text className={`${meta.colorClass} font-semibold text-base`}>Difficulty: {meta.label}</Text>
        <Text className="text-gray-500 text-xs">{meta.description}</Text>
      </View>
    </View>
  );
};

export default QuestDifficultyExtended;
