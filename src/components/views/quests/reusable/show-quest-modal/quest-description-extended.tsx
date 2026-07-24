import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

interface QuestDescriptionExtendedProps {
  description: string | null;
}

const QuestDescriptionExtended: React.FC<QuestDescriptionExtendedProps> = ({ description }) => {
  const { t } = useTranslation();

  if (!description) return null;

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-start gap-4">
      <Text className={`text-2xl my-auto`}>💬</Text>
      <View className="flex-1">
        <Text className="font-semibold text-base text-yellow-500 mb-1">{t('quests.reusable.description.heading')}</Text>
        <Text className="text-gray-700 text-sm">{description}</Text>
      </View>
    </View>
  );
};

export default QuestDescriptionExtended;
