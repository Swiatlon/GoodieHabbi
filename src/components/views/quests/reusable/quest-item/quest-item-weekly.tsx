import React from 'react';
import { View, Text } from 'react-native';
import { WeekdayEnumType } from '@/contract/quests/base-quests';

interface QuestItemDateWeeklyProps {
  weekdays?: WeekdayEnumType[];
}

const dayAbbreviations: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tues',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

const QuestItemDateWeekly: React.FC<QuestItemDateWeeklyProps> = ({ weekdays }) => {
  if (!weekdays || weekdays.length === 0) {
    return null;
  }

  const isAllDays = weekdays.length === 7;

  if (isAllDays) {
    return (
      <View className="px-3 py-1 mr-auto rounded-full bg-primary justify-center items-center">
        <Text className="text-white text-sm font-bold">All Days</Text>
      </View>
    );
  }

  if (weekdays.length <= 3) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {weekdays.map(day => (
          <View key={day} className="px-3 py-1 rounded-full bg-primary justify-center items-center">
            <Text className="text-white text-sm font-bold">{dayAbbreviations[day.toLowerCase()] || day[0].toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {weekdays.map(day => (
        <View key={day} className="w-6 h-6 rounded-full bg-primary justify-center items-center">
          <Text className="text-white text-xs font-bold">{dayAbbreviations[day.toLowerCase()][0].toUpperCase() || day[0].toUpperCase()}</Text>
        </View>
      ))}
    </View>
  );
};
export default QuestItemDateWeekly;
