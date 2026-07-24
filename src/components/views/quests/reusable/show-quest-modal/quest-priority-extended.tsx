import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { PriorityEnum, PriorityEnumType } from '@/contract/quests/base-quests';

interface QuestPriorityExtendedProps {
  priority?: PriorityEnumType | null;
}

const priorityMeta = {
  [PriorityEnum.HIGH]: {
    labelKey: 'quests.reusable.form.priorities.high',
    icon: '🔥',
    colorClass: 'text-red-500',
    descriptionKey: 'quests.reusable.priority.descriptions.high',
  },
  [PriorityEnum.MEDIUM]: {
    labelKey: 'quests.reusable.form.priorities.medium',
    icon: '⚡',
    colorClass: 'text-yellow-500',
    descriptionKey: 'quests.reusable.priority.descriptions.medium',
  },
  [PriorityEnum.LOW]: {
    labelKey: 'quests.reusable.form.priorities.low',
    icon: '🧘',
    colorClass: 'text-green-500',
    descriptionKey: 'quests.reusable.priority.descriptions.low',
  },
};

const QuestPriorityExtended: React.FC<QuestPriorityExtendedProps> = ({ priority }) => {
  const { t } = useTranslation();

  if (!priority) return null;

  const meta = priorityMeta[priority];

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className={`${meta.colorClass} text-2xl my-auto`}>{meta.icon}</Text>
      <View>
        <Text className={`${meta.colorClass} font-semibold text-base`}>
          {t('quests.reusable.priority.prefix')} {t(meta.labelKey)}
        </Text>
        <Text className="text-gray-500 text-xs">{t(meta.descriptionKey)}</Text>
      </View>
    </View>
  );
};

export default QuestPriorityExtended;
