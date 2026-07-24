import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native';
import Button from '@/components/shared/button/button';
import { WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';

const DAYS_OF_WEEK = [
  { labelKey: 'quests.reusable.days.monday', value: WeekdayEnum.MONDAY },
  { labelKey: 'quests.reusable.days.tuesday', value: WeekdayEnum.TUESDAY },
  { labelKey: 'quests.reusable.days.wednesday', value: WeekdayEnum.WEDNESDAY },
  { labelKey: 'quests.reusable.days.thursday', value: WeekdayEnum.THURSDAY },
  { labelKey: 'quests.reusable.days.friday', value: WeekdayEnum.FRIDAY },
  { labelKey: 'quests.reusable.days.saturday', value: WeekdayEnum.SATURDAY },
  { labelKey: 'quests.reusable.days.sunday', value: WeekdayEnum.SUNDAY },
];

const WeeklyPicker: React.FC = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const toggleSelection = (selectedDays: string[], day: string) => {
    return selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day];
  };

  return (
    <Controller
      name="weekdays"
      control={control}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        const selectedDays = value as WeekdayEnumType[];

        return (
          <View className="flex gap-2">
            <Text className="text-sm font-semibold text-gray-500">
              7️⃣ {t('quests.reusable.weekly.daysLabel')}
              <Text className="text-red-500">*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <View className="flex-row gap-2">
                {DAYS_OF_WEEK.map(({ labelKey, value: dayValue }) => (
                  <Button
                    key={dayValue}
                    label={t(labelKey)}
                    onPress={() => onChange(toggleSelection(selectedDays, dayValue))}
                    styleType={selectedDays.includes(dayValue) ? 'primary' : 'secondary'}
                    className="px-3 py-2 rounded-lg"
                  />
                ))}
              </View>
            </ScrollView>
            {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default WeeklyPicker;
