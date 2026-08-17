import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IWorkoutSessionSummary, WorkoutSessionStatusEnum } from '@/contract/workouts/workouts.contract';
import { safeDateFormat } from '@/utils/utils/utils';

interface SessionSummaryItemProps {
  session: IWorkoutSessionSummary;
  onPress: () => void;
}

const STATUS_STYLE: Record<WorkoutSessionStatusEnum, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  [WorkoutSessionStatusEnum.InProgress]: { icon: 'time-outline', color: '#1987EE' },
  [WorkoutSessionStatusEnum.Completed]: { icon: 'checkmark-circle-outline', color: '#10B981' },
  [WorkoutSessionStatusEnum.Abandoned]: { icon: 'close-circle-outline', color: '#9ca3af' },
};

const SessionSummaryItem: React.FC<SessionSummaryItemProps> = ({ session, onPress }) => {
  const { t } = useTranslation();
  const status = STATUS_STYLE[session.status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center px-4 py-3 bg-white" testID="session-summary-item">
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${status.color}20` }}>
        <Ionicons name={status.icon} size={18} color={status.color} />
      </View>
      <View className="flex-1 pr-3">
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
          {session.name}
        </Text>
        <Text className="text-xs text-gray-500 mt-0.5">
          {safeDateFormat(session.performedOn)} · {t('workouts.sessions.totals.sets')}: {session.totals.setCount} ·{' '}
          {t('workouts.sessions.totals.volume')}: {session.totals.totalVolume}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );
};

export default SessionSummaryItem;
