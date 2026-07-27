import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WeekdayEnumType } from '@/contract/quests/base-quests';

interface QuestItemDateWeeklyProps {
  weekdays?: WeekdayEnumType[];
  onPress?: () => void;
}

const dayAbbreviationKeys: Record<string, string> = {
  monday: 'quests.reusable.days.monday',
  tuesday: 'quests.reusable.days.tuesday',
  wednesday: 'quests.reusable.days.wednesday',
  thursday: 'quests.reusable.days.thursday',
  friday: 'quests.reusable.days.friday',
  saturday: 'quests.reusable.days.saturday',
  sunday: 'quests.reusable.days.sunday',
};

const QuestItemDateWeekly: React.FC<QuestItemDateWeeklyProps> = ({ weekdays, onPress }) => {
  const { t } = useTranslation();
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
        <Text className="text-white text-sm font-bold">{t('quests.reusable.weekly.allDays')}</Text>
      </View>
    );
  }

  if (weekdays.length <= 3) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {weekdays.map(day => {
          const dayKey = dayAbbreviationKeys[day.toLowerCase()];
          return (
            <View key={day} className="px-3 py-2 rounded-full bg-primary justify-center items-center">
              <Text className="text-white text-sm font-bold">{dayKey ? t(dayKey) : day[0].toUpperCase()}</Text>
            </View>
          );
        })}
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
        <View className="flex-row flex-nowrap gap-2">
          {weekdays.map(day => {
            const dayKey = dayAbbreviationKeys[day.toLowerCase()];
            return (
              <View key={day} className="px-3 py-2 rounded-full bg-primary justify-center items-center">
                <Text className="text-white text-xs font-bold">{dayKey ? t(dayKey).toUpperCase() : day[0].toUpperCase()}</Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default QuestItemDateWeekly;
