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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center px-4 py-3 bg-white" testID="personal-record-item">
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-amber-50">
        <Ionicons name="trophy-outline" size={18} color="#F59E0B" />
      </View>
      <View className="flex-1 pr-3">
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
          {record.exerciseName}
        </Text>
        <Text className="text-xs text-gray-500 mt-0.5">
          {record.maxWeight != null && `${t('workouts.analytics.maxWeight')}: ${record.maxWeight} ${weightUnit} · `}
          {record.maxReps != null && `${t('workouts.analytics.maxReps')}: ${record.maxReps} · `}
          {t('workouts.analytics.lastPerformedOn')}: {safeDateFormat(record.lastPerformedOn)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );
};

export default PersonalRecordItem;
