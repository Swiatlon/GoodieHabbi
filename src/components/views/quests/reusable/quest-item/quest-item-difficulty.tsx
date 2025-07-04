import React from 'react';
import { Text, View } from 'react-native';
import { DifficultyEnum, DifficultyEnumType } from '@/contract/quests/base-quests';

interface QuestItemDifficultyProps {
  difficulty: DifficultyEnumType | null;
}

const difficultyMeta = {
  [DifficultyEnum.EASY]: {
    label: 'Easy',
    icon: '⚔️',
    color: 'text-green-600',
  },
  [DifficultyEnum.MEDIUM]: {
    label: 'Medium',
    icon: '⚔️⚔️',
    color: 'text-yellow-600',
  },
  [DifficultyEnum.HARD]: {
    label: 'Hard',
    icon: '⚔️⚔️⚔️',
    color: 'text-orange-600',
  },
  [DifficultyEnum.IMPOSSIBLE]: {
    label: 'Impossible',
    icon: '💀',
    color: 'text-red-700 font-extrabold',
  },
};

const QuestItemDifficulty: React.FC<QuestItemDifficultyProps> = ({ difficulty }) => {
  if (!difficulty) return null;

  const meta = difficultyMeta[difficulty];

  return (
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-semibold ${meta.color}`}>
        {meta.icon} {meta.label}
      </Text>
    </View>
  );
};

export default QuestItemDifficulty;
