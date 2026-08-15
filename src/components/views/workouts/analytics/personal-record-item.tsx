import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IPersonalRecord } from '@/contract/workouts/workouts.contract';
import { safeDateFormat } from '@/utils/utils/utils';

interface PersonalRecordItemProps {
  record: IPersonalRecord;
  weightUnit: string;
  onPress: () => void;
}

const PersonalRecordItem: React.FC<PersonalRecordItemProps> = ({ record, weightUnit, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between p-4 border-b border-gray-100" testID="personal-record-item">
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-gray-800">{record.exerciseName}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">
          {record.maxWeight != null && `${t('workouts.analytics.maxWeight')}: ${record.maxWeight} ${weightUnit} · `}
          {record.maxReps != null && `${t('workouts.analytics.maxReps')}: ${record.maxReps} · `}
          {t('workouts.analytics.lastPerformedOn')}: {safeDateFormat(record.lastPerformedOn)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
};

export default PersonalRecordItem;
