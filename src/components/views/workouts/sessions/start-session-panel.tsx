import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import Select from '@/components/shared/select/select';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useGetRoutinesQuery } from '@/redux/api/workouts/routines-api';
import { useStartSessionMutation } from '@/redux/api/workouts/sessions-api';
import { IApiError } from '@/types/global-types';

const StartSessionPanel: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: routines = [] } = useGetRoutinesQuery({ includeArchived: false });
  const [startSession, { isLoading }] = useStartSessionMutation();
  const [routineId, setRoutineId] = useState<number | null>(null);
  const [adHocName, setAdHocName] = useState('');

  const canStart = routineId != null || adHocName.trim() !== '';

  const handleStart = async () => {
    try {
      await startSession(routineId != null ? { routineId } : { name: adHocName.trim() }).unwrap();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({ text: error.data?.message || t('workouts.sessions.startError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-5 p-6" testID="start-session-panel">
      <Ionicons name="barbell-outline" size={56} color="#1987EE" />
      <Text className="text-lg font-bold text-gray-800 text-center">{t('workouts.sessions.noActiveSession')}</Text>

      {routines.length > 0 && (
        <View className="w-full gap-2">
          <Text className="text-sm font-semibold text-gray-500">{t('workouts.sessions.pickRoutineLabel')}</Text>
          <Select
            placeholder={t('workouts.sessions.pickRoutinePlaceholder')}
            value={routineId}
            onChange={value => {
              setRoutineId(value != null ? Number(value) : null);
              if (value != null) setAdHocName('');
            }}
            onClear={() => setRoutineId(null)}
            isModalVersion={true}
            options={routines.map(routine => ({ label: routine.name, value: routine.id }))}
          />
        </View>
      )}

      <View className="w-full gap-2">
        <Text className="text-sm font-semibold text-gray-500">{t('workouts.sessions.adHocNameLabel')}</Text>
        <TextInput
          value={adHocName}
          onChangeText={text => {
            setAdHocName(text);
            if (text.trim() !== '') setRoutineId(null);
          }}
          placeholder={t('workouts.sessions.adHocNamePlaceholder')}
          className="border border-gray-300 rounded-lg px-3 py-3 text-black"
          testID="input-ad-hoc-session-name"
        />
      </View>

      <Button
        label={t('workouts.sessions.startButton')}
        onPress={handleStart}
        disabled={!canStart || isLoading}
        startIcon={<Ionicons name="play-circle-outline" size={20} color="#fff" />}
        className="w-full justify-center"
        testID="btn-start-session"
      />
    </View>
  );
};

export default StartSessionPanel;
