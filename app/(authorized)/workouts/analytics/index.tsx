import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import EmptyState from '@/components/shared/empty-state/empty-state';
import KpiCard from '@/components/shared/kpi-card/kpi-card';
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
    <View className="flex-1 bg-gray-50" testID="workouts-analytics-screen">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-primary">{t('workouts.analytics.title')}</Text>
        <Text className="text-xs text-gray-400 mt-1 mb-4">{t('workouts.analytics.rangeLabel', { days: RANGE_DAYS })}</Text>

        <View className="flex-row gap-2 mb-4">
          <KpiCard label={t('workouts.analytics.sessions')} value={String(summary?.sessionCount ?? 0)} icon="calendar-outline" color="#1987EE" />
          <KpiCard label={t('workouts.sessions.totals.sets')} value={String(summary?.setCount ?? 0)} icon="layers-outline" color="#F59E0B" />
          <KpiCard
            label={t('workouts.sessions.totals.volume')}
            value={`${summary?.totalVolume ?? 0} ${weightUnit}`}
            icon="trending-up-outline"
            color="#8B5CF6"
          />
        </View>

        {summary && summary.byMuscleGroup.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-500 mb-2">{t('workouts.analytics.byMuscleGroup')}</Text>
            <View className="bg-white rounded-2xl shadow-sm p-4 gap-3">
              {summary.byMuscleGroup.map(entry => (
                <MuscleGroupBar key={entry.muscleGroup} entry={entry} maxVolume={maxVolume} weightUnit={weightUnit} />
              ))}
            </View>
          </View>
        )}

        <Text className="text-sm font-semibold text-gray-500 mb-2">{t('workouts.analytics.personalRecords')}</Text>
        {personalRecords.length === 0 ? (
          <EmptyState icon="trophy-outline" message={t('workouts.analytics.noPersonalRecords')} />
        ) : (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {personalRecords.map((record, idx) => (
              <View key={record.exerciseId} className={idx < personalRecords.length - 1 ? 'border-b border-gray-50' : ''}>
                <PersonalRecordItem
                  record={record}
                  weightUnit={weightUnit}
                  onPress={() => router.push(`/(authorized)/workouts/analytics/${record.exerciseId}`)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WorkoutAnalyticsScreen;
