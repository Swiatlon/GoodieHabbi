import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { PriorityEnum, PriorityEnumType } from '@/contract/quests/base-quests';

interface QuestItemPriorityProps {
  priority: PriorityEnumType | null;
}

const priorityMeta = {
  [PriorityEnum.HIGH]: { labelKey: 'quests.reusable.form.priorities.high', color: 'text-red-500', icon: '🔥' },
  [PriorityEnum.MEDIUM]: { labelKey: 'quests.reusable.form.priorities.medium', color: 'text-yellow-500', icon: '⚡' },
  [PriorityEnum.LOW]: { labelKey: 'quests.reusable.form.priorities.low', color: 'text-green-500', icon: '🧘' },
};

const QuestItemPriority: React.FC<QuestItemPriorityProps> = ({ priority }) => {
  const { t } = useTranslation();

  if (!priority) return null;

  const meta = priorityMeta[priority];

  return (
    <View className="flex-row items-center gap-2">
      <Text className={`text-sm font-bold ${meta.color}`}>
        {meta.icon} {t(meta.labelKey)}
      </Text>
    </View>
  );
};

export default QuestItemPriority;
