import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Loader from '@/components/shared/loader/loader';
import MuscleGroupBar from '@/components/views/workouts/analytics/muscle-group-bar';
import PersonalRecordItem from '@/components/views/workouts/analytics/personal-record-item';
import dayjs from '@/configs/day-js-config';
import { useGetPersonalRecordsQuery, useGetWorkoutSummaryQuery } from '@/redux/api/workouts/analytics-api';
import { useGetWorkoutSettingsQuery } from '@/redux/api/workouts/settings-api';
import { toIsoDate } from '@/utils/utils/utils';

const RANGE_DAYS = 30;

const WorkoutAnalyticsScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const to = toIsoDate(new Date()) ?? '';
  const from = toIsoDate(dayjs().subtract(RANGE_DAYS, 'day').toDate()) ?? '';

  const { data: summary, isLoading: isSummaryLoading } = useGetWorkoutSummaryQuery({ from, to });
  const { data: personalRecords = [], isLoading: isRecordsLoading } = useGetPersonalRecordsQuery();
  const { data: settings } = useGetWorkoutSettingsQuery();
  const weightUnit = settings?.weightUnit ?? 'kg';

  if (isSummaryLoading || isRecordsLoading) {
    return <Loader message={t('workouts.analytics.fetching')} />;
  }

  const maxVolume = Math.max(0, ...(summary?.byMuscleGroup ?? []).map(entry => entry.totalVolume));

  return (
    <View className="flex-1 bg-white" testID="workouts-analytics-screen">
      <FlatList
        data={personalRecords}
        keyExtractor={item => item.exerciseId.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View className="px-4 pt-4 gap-4">
            <Text className="text-2xl font-bold text-primary">{t('workouts.analytics.title')}</Text>
            <Text className="text-xs text-gray-400 -mt-2">{t('workouts.analytics.rangeLabel', { days: RANGE_DAYS })}</Text>

            <View className="flex-row justify-between bg-gray-50 rounded-xl p-3">
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">{summary?.sessionCount ?? 0}</Text>
                <Text className="text-[10px] text-gray-400">{t('workouts.analytics.sessions')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">{summary?.setCount ?? 0}</Text>
                <Text className="text-[10px] text-gray-400">{t('workouts.sessions.totals.sets')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">
                  {summary?.totalVolume ?? 0} {weightUnit}
                </Text>
                <Text className="text-[10px] text-gray-400">{t('workouts.sessions.totals.volume')}</Text>
              </View>
            </View>

            {summary && summary.byMuscleGroup.length > 0 && (
              <View className="gap-3">
                <Text className="text-sm font-semibold text-gray-500">{t('workouts.analytics.byMuscleGroup')}</Text>
                {summary.byMuscleGroup.map(entry => (
                  <MuscleGroupBar key={entry.muscleGroup} entry={entry} maxVolume={maxVolume} weightUnit={weightUnit} />
                ))}
              </View>
            )}

            <Text className="text-sm font-semibold text-gray-500">{t('workouts.analytics.personalRecords')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PersonalRecordItem
            record={item}
            weightUnit={weightUnit}
            onPress={() => router.push(`/(authorized)/workouts/analytics/${item.exerciseId}`)}
          />
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-2 px-4">{t('workouts.analytics.noPersonalRecords')}</Text>}
      />
    </View>
  );
};

export default WorkoutAnalyticsScreen;
