import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

interface QuestStatusExtendedProps {
  isCompleted: boolean;
}

const QuestStatusExtended: React.FC<QuestStatusExtendedProps> = ({ isCompleted }) => {
  const { t } = useTranslation();
  const emoji = isCompleted ? '✅' : '⏳';
  const title = isCompleted ? t('quests.reusable.status.completedTitle') : t('quests.reusable.status.inProgressTitle');
  const titleColor = isCompleted ? 'text-green-600' : 'text-yellow-600';
  const description = isCompleted ? t('quests.reusable.status.completedDescription') : t('quests.reusable.status.inProgressDescription');

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-start gap-4">
      <Text className={`text-2xl my-auto`}>{emoji}</Text>
      <View className="flex-1">
        <Text className={`text-md font-semibold ${titleColor}`}>{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
    </View>
  );
};

export default QuestStatusExtended;
