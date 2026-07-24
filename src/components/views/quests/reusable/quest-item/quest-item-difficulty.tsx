import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { DifficultyEnum, DifficultyEnumType } from '@/contract/quests/base-quests';

interface QuestItemDifficultyProps {
  difficulty: DifficultyEnumType | null;
}

const difficultyMeta = {
  [DifficultyEnum.EASY]: {
    labelKey: 'quests.reusable.form.difficulties.easy',
    icon: '⚔️',
    color: 'text-green-600',
  },
  [DifficultyEnum.MEDIUM]: {
    labelKey: 'quests.reusable.form.difficulties.medium',
    icon: '⚔️⚔️',
    color: 'text-yellow-600',
  },
  [DifficultyEnum.HARD]: {
    labelKey: 'quests.reusable.form.difficulties.hard',
    icon: '⚔️⚔️⚔️',
    color: 'text-orange-600',
  },
  [DifficultyEnum.IMPOSSIBLE]: {
    labelKey: 'quests.reusable.form.difficulties.impossible',
    icon: '💀',
    color: 'text-red-700 font-extrabold',
  },
};

const QuestItemDifficulty: React.FC<QuestItemDifficultyProps> = ({ difficulty }) => {
  const { t } = useTranslation();

  if (!difficulty) return null;

  const meta = difficultyMeta[difficulty];

  return (
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-semibold ${meta.color}`}>
        {meta.icon} {t(meta.labelKey)}
      </Text>
    </View>
  );
};

export default QuestItemDifficulty;
