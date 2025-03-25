import React from 'react';
import { View, Text } from 'react-native';
import dayjs from '@/configs/day-js-config';
import { NullableString, UndefinedString } from '@/types/global-types';
import { safeDateFormat } from '@/utils/utils';

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
    <View>
      <Text className="text-sm text-gray-400">
        {dateLabel}
        {endDate && daysLeft >= 0 && <Text className={`font-bold ${daysLeftColor}`}>({daysLeft} days left)</Text>}
      </Text>
    </View>
  );
};

export default QuestItemDate;
