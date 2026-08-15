import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loader from '@/components/shared/loader/loader';
import AddSessionExercisePicker from '@/components/views/workouts/sessions/add-session-exercise-picker';
import SessionExerciseCard from '@/components/views/workouts/sessions/session-exercise-card';
import SessionMetadataForm from '@/components/views/workouts/sessions/session-metadata-form';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useDeleteSessionMutation, useGetSessionByIdQuery } from '@/redux/api/workouts/sessions-api';
import { useGetWorkoutSettingsQuery } from '@/redux/api/workouts/settings-api';
import { IApiError } from '@/types/global-types';

const SessionDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = Number(id);

  const { data: session, isLoading } = useGetSessionByIdQuery({ id: sessionId });
  const { data: settings } = useGetWorkoutSettingsQuery();
  const weightUnit = settings?.weightUnit ?? 'kg';
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

  if (isLoading || !session) {
    return <Loader message={t('workouts.sessions.fetchingDetail')} />;
  }

  const handleDelete = () => {
    Alert.alert(t('workouts.sessions.deleteTitle'), t('workouts.sessions.deleteMessage', { name: session.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSession({ id: session.id }).unwrap();
            router.back();
          } catch (err) {
            const error = err as IApiError;
            showSnackbar({ text: error.data?.message || t('workouts.sessions.deleteError'), variant: SnackbarVariantEnum.ERROR });
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white" testID="workouts-session-detail-screen">
      <View className="flex-row items-center px-2 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#4b465d" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-800">{t('workouts.sessions.detailTitle')}</Text>
        <TouchableOpacity onPress={handleDelete} disabled={isDeleting} className="w-9 h-9 items-center justify-center">
          <Ionicons name="trash-outline" size={20} color="#e53e3e" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
        <SessionMetadataForm session={session} />

        <View className="flex-row justify-between bg-gray-50 rounded-xl p-3">
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

        {session.exercises.map(exercise => (
          <SessionExerciseCard key={exercise.id} sessionId={session.id} exercise={exercise} weightUnit={weightUnit} />
        ))}

        <AddSessionExercisePicker session={session} />
      </ScrollView>
    </View>
  );
};

export default SessionDetailScreen;
