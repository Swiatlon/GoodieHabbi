import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

interface QuestItemDateProps {
  startDate?: string;
  endDate?: string;
}

const formatDate = (date?: string): string | null => {
  return date ? moment(date).format('DD.MM.YYYY') : null;
};

const getDateLabel = (startDate: string | null, endDate: string | null): string | null => {
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
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

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
