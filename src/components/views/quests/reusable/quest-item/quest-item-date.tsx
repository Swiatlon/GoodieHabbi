import React from 'react';
import { View, Text } from 'react-native';
import { NullableString } from '@/types/global-types';
import { safeDateFormat } from '@/utils/utils';

interface QuestItemDateProps {
  startDate: NullableString;
  endDate: NullableString;
}

const getDateLabel = (startDate: NullableString, endDate: NullableString): NullableString => {
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  if (startDate) {
    return `Start: ${startDate}`;
  }

  if (endDate) {
    return `End: ${endDate}`;
  }

  return null;
};

const QuestItemDate: React.FC<QuestItemDateProps> = ({ startDate, endDate }) => {
  const formattedStartDate = safeDateFormat(startDate);
  const formattedEndDate = safeDateFormat(endDate);
  const dateLabel = getDateLabel(formattedStartDate, formattedEndDate);

  if (!dateLabel) {
    return null;
  }

  return (
    <View>
      <Text className="text-sm text-gray-400">{dateLabel}</Text>
    </View>
  );
};

export default QuestItemDate;
