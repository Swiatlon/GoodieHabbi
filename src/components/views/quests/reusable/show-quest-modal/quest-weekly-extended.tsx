import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';

interface QuestWeekdaysExtendedProps {
  weekdays?: WeekdayEnumType[];
}

const DAY_DISPLAY: { key: WeekdayEnumType; labelKey: string; emoji: string }[] = [
  { key: WeekdayEnum.MONDAY, labelKey: 'quests.reusable.days.monday', emoji: '🌞' },
  { key: WeekdayEnum.TUESDAY, labelKey: 'quests.reusable.days.tuesday', emoji: '🔥' },
  { key: WeekdayEnum.WEDNESDAY, labelKey: 'quests.reusable.days.wednesday', emoji: '🐪' },
  { key: WeekdayEnum.THURSDAY, labelKey: 'quests.reusable.days.thursday', emoji: '⚡' },
  { key: WeekdayEnum.FRIDAY, labelKey: 'quests.reusable.days.friday', emoji: '🎉' },
  { key: WeekdayEnum.SATURDAY, labelKey: 'quests.reusable.days.saturday', emoji: '🛌' },
  { key: WeekdayEnum.SUNDAY, labelKey: 'quests.reusable.days.sunday', emoji: '☕' },
];

const QuestWeekdaysExtended: React.FC<QuestWeekdaysExtendedProps> = ({ weekdays }) => {
  const { t } = useTranslation();

  if (!weekdays || weekdays.length === 0) return null;

  const isActive = (day: WeekdayEnumType) => weekdays.includes(day);

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-2">
        <Text className="text-2xl">🗓️</Text>
        <Text className="font-semibold text-gray-700">{t('quests.reusable.weekly.heading')}</Text>
      </View>

      <View className="flex-row flex-wrap justify-start gap-y-3 gap-x-6 px-8 pr-4">
        {DAY_DISPLAY.map(({ key, labelKey, emoji }) => {
          const active = isActive(key);
          return (
            <View
              key={key}
              className={`items-center w-[13%] min-w-[50px] p-2 rounded-lg border ${
                active ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-200'
              }`}
            >
              <Text className={`text-lg ${active ? 'text-white' : 'text-gray-400'}`}>{emoji}</Text>
              <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{t(labelKey)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default QuestWeekdaysExtended;
