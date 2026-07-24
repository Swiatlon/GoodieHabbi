import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { DifficultyEnum, DifficultyEnumType } from '@/contract/quests/base-quests';

interface QuestDifficultyExtendedProps {
  difficulty?: DifficultyEnumType | null;
}

const difficultyMeta = {
  [DifficultyEnum.EASY]: {
    labelKey: 'quests.reusable.form.difficulties.easy',
    icon: '🍃',
    colorClass: 'text-green-500',
    descriptionKey: 'quests.reusable.difficulty.descriptions.easy',
  },
  [DifficultyEnum.MEDIUM]: {
    labelKey: 'quests.reusable.form.difficulties.medium',
    icon: '🧗‍♂️',
    colorClass: 'text-yellow-500',
    descriptionKey: 'quests.reusable.difficulty.descriptions.medium',
  },
  [DifficultyEnum.HARD]: {
    labelKey: 'quests.reusable.form.difficulties.hard',
    icon: '💀',
    colorClass: 'text-red-500',
    descriptionKey: 'quests.reusable.difficulty.descriptions.hard',
  },
  [DifficultyEnum.IMPOSSIBLE]: {
    labelKey: 'quests.reusable.form.difficulties.impossible',
    icon: '☠️',
    colorClass: 'text-red-500 font-extrabold',
    descriptionKey: 'quests.reusable.difficulty.descriptions.impossible',
  },
};

const QuestDifficultyExtended: React.FC<QuestDifficultyExtendedProps> = ({ difficulty }) => {
  const { t } = useTranslation();

  if (!difficulty) return null;

  const meta = difficultyMeta[difficulty];

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className={`${meta.colorClass} text-2xl my-auto`}>{meta.icon}</Text>
      <View>
        <Text className={`${meta.colorClass} font-semibold text-base`}>
          {t('quests.reusable.difficulty.prefix')} {t(meta.labelKey)}
        </Text>
        <Text className="text-gray-500 text-xs">{t(meta.descriptionKey)}</Text>
      </View>
    </View>
  );
};

export default QuestDifficultyExtended;
