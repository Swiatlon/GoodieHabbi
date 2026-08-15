import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/components/shared/loader/loader';
import AddSessionExercisePicker from '@/components/views/workouts/sessions/add-session-exercise-picker';
import SessionExerciseCard from '@/components/views/workouts/sessions/session-exercise-card';
import SessionSupplementPanel from '@/components/views/workouts/sessions/session-supplement-panel';
import StartSessionPanel from '@/components/views/workouts/sessions/start-session-panel';
import dayjs from '@/configs/day-js-config';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useAbandonSessionMutation, useFinishSessionMutation, useGetActiveSessionQuery } from '@/redux/api/workouts/sessions-api';
import { useGetWorkoutSettingsQuery } from '@/redux/api/workouts/settings-api';
import { IApiError } from '@/types/global-types';

const ActiveSessionScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { data: session, isLoading } = useGetActiveSessionQuery();
  const { data: settings } = useGetWorkoutSettingsQuery();
  const weightUnit = settings?.weightUnit ?? 'kg';
  const [finishSession, { isLoading: isFinishing }] = useFinishSessionMutation();
  const [abandonSession, { isLoading: isAbandoning }] = useAbandonSessionMutation();

  if (isLoading) {
    return <Loader message={t('workouts.sessions.fetchingActive')} />;
  }

  if (!session) {
    return <StartSessionPanel />;
  }

  const handleFinish = () => {
    Alert.alert(t('workouts.sessions.finishTitle'), t('workouts.sessions.finishMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('workouts.sessions.finishConfirm'),
        onPress: async () => {
          try {
            await finishSession({ id: session.id }).unwrap();
            showSnackbar({ text: t('workouts.sessions.finishedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('workouts.sessions.finishError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  const handleAbandon = () => {
    Alert.alert(t('workouts.sessions.abandonTitle'), t('workouts.sessions.abandonMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('workouts.sessions.abandonConfirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await abandonSession({ id: session.id }).unwrap();
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('workouts.sessions.abandonError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white" testID="workouts-active-session-screen">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
        <View>
          <Text className="text-2xl font-bold text-primary">{session.name}</Text>
          <Text className="text-xs text-gray-400">
            {t('workouts.sessions.startedAt', { time: dayjs.utc(session.startedAt).local().format('HH:mm') })}
          </Text>
        </View>

        <View className="flex-row justify-between bg-gray-50 rounded-xl p-3">
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">{session.totals.exerciseCount}</Text>
            <Text className="text-[10px] text-gray-400">{t('workouts.sessions.totals.exercises')}</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">{session.totals.setCount}</Text>
            <Text className="text-[10px] text-gray-400">{t('workouts.sessions.totals.sets')}</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">{session.totals.totalReps}</Text>
            <Text className="text-[10px] text-gray-400">{t('workouts.sessions.totals.reps')}</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {session.totals.totalVolume} {weightUnit}
            </Text>
            <Text className="text-[10px] text-gray-400">{t('workouts.sessions.totals.volume')}</Text>
          </View>
        </View>

        <SessionSupplementPanel sessionId={session.id} performedOn={session.performedOn} />

        {session.exercises.map(exercise => (
          <SessionExerciseCard key={exercise.id} sessionId={session.id} exercise={exercise} weightUnit={weightUnit} />
        ))}

        <AddSessionExercisePicker session={session} />
      </ScrollView>

      <View className="flex-row gap-3 p-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleAbandon}
          disabled={isAbandoning}
          className="flex-1 flex-row items-center justify-center gap-1 border border-red-400 rounded-lg py-3"
          testID="btn-abandon-session"
        >
          <Ionicons name="close-circle-outline" size={18} color="#e53e3e" />
          <Text className="text-red-500 font-semibold">{t('workouts.sessions.abandon')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleFinish}
          disabled={isFinishing}
          className="flex-1 flex-row items-center justify-center gap-1 bg-primary rounded-lg py-3"
          testID="btn-finish-session"
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="white" />
          <Text className="text-white font-semibold">{t('workouts.sessions.finish')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActiveSessionScreen;
