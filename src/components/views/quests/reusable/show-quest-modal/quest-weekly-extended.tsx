import React from 'react';
import { View, Text } from 'react-native';
import { WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';

interface QuestWeekdaysExtendedProps {
  weekdays?: WeekdayEnumType[];
}

const DAY_DISPLAY: { key: WeekdayEnumType; label: string; emoji: string }[] = [
  { key: WeekdayEnum.MONDAY, label: 'Mon', emoji: '🌞' },
  { key: WeekdayEnum.TUESDAY, label: 'Tue', emoji: '🔥' },
  { key: WeekdayEnum.WEDNESDAY, label: 'Wed', emoji: '🐪' },
  { key: WeekdayEnum.THURSDAY, label: 'Thu', emoji: '⚡' },
  { key: WeekdayEnum.FRIDAY, label: 'Fri', emoji: '🎉' },
  { key: WeekdayEnum.SATURDAY, label: 'Sat', emoji: '🛌' },
  { key: WeekdayEnum.SUNDAY, label: 'Sun', emoji: '☕' },
];

const QuestWeekdaysExtended: React.FC<QuestWeekdaysExtendedProps> = ({ weekdays }) => {
  if (!weekdays || weekdays.length === 0) return null;

  const isActive = (day: WeekdayEnumType) => weekdays.includes(day);

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-2">
        <Text className="text-2xl">🗓️</Text>
        <Text className="font-semibold text-gray-700">Repeats On</Text>
      </View>

      <View className="flex-row flex-wrap justify-start gap-y-3 gap-x-6 px-8 pr-4">
        {DAY_DISPLAY.map(({ key, label, emoji }) => {
          const active = isActive(key);
          return (
            <View
              key={key}
              className={`items-center w-[13%] min-w-[50px] p-2 rounded-lg border ${
                active ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-200'
              }`}
            >
              <Text className={`text-lg ${active ? 'text-white' : 'text-gray-400'}`}>{emoji}</Text>
              <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default QuestWeekdaysExtended;
