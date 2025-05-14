import React from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import dayjs from '@/configs/day-js-config';
import { NullableString, UndefinedString } from '@/types/global-types';
import { safeDateFormat } from '@/utils/utils/utils';

interface QuestItemDateProps {
  startDate: NullableString;
  endDate: NullableString;
}

const getDateLabel = (startDate: UndefinedString, endDate: UndefinedString): NullableString => {
  if (startDate && endDate) {
    return `${startDate} - ${endDate} `;
  }

  if (startDate) {
    return `Start: ${startDate}`;
  }

  if (endDate) {
    return `End: ${endDate} `;
  }

  return null;
};

const QuestItemDate: React.FC<QuestItemDateProps> = ({ startDate, endDate }) => {
  const formattedStartDate = safeDateFormat(startDate);
  const formattedEndDate = safeDateFormat(endDate);

  const dateLabel = getDateLabel(formattedStartDate, formattedEndDate);
  const daysLeft = Math.ceil(dayjs(dayjs(endDate)).diff(dayjs(), 'day', true));

  if (!dateLabel) {
    return null;
  }

  const daysLeftColor = daysLeft <= 5 ? 'text-error' : daysLeft > 5 && daysLeft <= 10 ? 'text-warning' : 'text-gray-500';

  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-sm text-gray-400">{dateLabel}</Text>
      {endDate && daysLeft >= 0 && <Text className={`text-sm font-bold ${daysLeftColor}`}>({daysLeft} days left)</Text>}
      {endDate && daysLeft < 0 && <MaterialIcons color="red" size={14} name="alarm-off" />}
    </View>
  );
};

export default QuestItemDate;
