import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SupplementTimingEnum } from '@/contract/supplements/supplements.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetChecklistQuery, useToggleIntakeMutation } from '@/redux/api/supplements/intakes-api';
import { IApiError } from '@/types/global-types';

interface SessionSupplementPanelProps {
  sessionId: number;
  performedOn: string;
}

const SessionSupplementPanel: React.FC<SessionSupplementPanelProps> = ({ sessionId, performedOn }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: checklist, isLoading } = useGetChecklistQuery({
    date: performedOn,
    timing: [SupplementTimingEnum.PreWorkout, SupplementTimingEnum.PostWorkout],
  });
  const [toggleIntake] = useToggleIntakeMutation();

  const handleToggle = async (item: NonNullable<typeof checklist>['items'][number]) => {
    try {
      await toggleIntake({
        supplementId: item.supplementId,
        slotId: item.slotId,
        date: performedOn,
        taken: !item.taken,
        workoutSessionId: sessionId,
      }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('supplements.checklist.toggleError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" color="#1987EE" />;
  }

  if (!checklist || checklist.items.length === 0) {
    return null;
  }

  return (
    <View className="border border-gray-200 rounded-xl p-3 gap-2" testID="session-supplement-panel">
      <Text className="text-sm font-semibold text-gray-500">{t('workouts.sessions.supplementsLabel')}</Text>
      {checklist.items.map(item => (
        <TouchableOpacity
          key={item.slotId}
          onPress={async () => handleToggle(item)}
          className="flex-row items-center justify-between py-1"
          testID="session-supplement-item"
        >
          <Text className="text-sm text-gray-700">
            {item.supplementName} · {t(`supplements.enums.timing.${item.timing}`)}
          </Text>
          <Ionicons name={item.taken ? 'checkbox' : 'square-outline'} size={22} color={item.taken ? '#10B981' : '#9ca3af'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SessionSupplementPanel;
