import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WeekdayEnumType } from '@/contract/quests/base-quests';

interface QuestItemDateWeeklyProps {
  weekdays?: WeekdayEnumType[];
  onPress?: () => void;
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

const QuestItemDateWeekly: React.FC<QuestItemDateWeeklyProps> = ({ weekdays, onPress }) => {
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    setIsScrolling(false);
  };

  if (!weekdays || weekdays.length === 0) {
    return null;
  }

  const isAllDays = weekdays.length === 7;

  if (isAllDays) {
    return (
      <View className="px-3 py-2 mr-auto rounded-full bg-primary justify-center items-center">
        <Text className="text-white text-sm font-bold">All Days</Text>
      </View>
    );
  }

  if (weekdays.length <= 3) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {weekdays.map(day => (
          <View key={day} className="px-3 py-2 rounded-full bg-primary justify-center items-center">
            <Text className="text-white text-sm font-bold">{dayAbbreviations[day.toLowerCase()] || day[0].toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      className="max-h-[50px] flex-row flex-nowrap"
      horizontal={true}
      onScrollBeginDrag={handleScrollBegin}
      onScrollEndDrag={handleScrollEnd}
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity activeOpacity={isScrolling ? 1 : 0.7} onPress={onPress}>
        <View className="flex-row flex-nowrap gap-2 mb-2">
          {weekdays.map(day => (
            <View key={day} className="px-3 py-2 rounded-full bg-primary justify-center items-center">
              <Text className="text-white text-xs font-bold">{dayAbbreviations[day.toLowerCase()].toUpperCase() || day[0].toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default QuestItemDateWeekly;
