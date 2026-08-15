import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Loader from '@/components/shared/loader/loader';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import SessionSummaryItem from '@/components/views/workouts/sessions/session-summary-item';
import { WorkoutSessionStatusEnum } from '@/contract/workouts/workouts.contract';
import { useGetSessionsQuery } from '@/redux/api/workouts/sessions-api';

const ACTIVE_TEXT_CLASS = 'text-primary';

const STATUS_TABS: { key: WorkoutSessionStatusEnum | 'All'; labelKey: string }[] = [
  { key: 'All', labelKey: 'workouts.sessions.statusFilters.all' },
  { key: WorkoutSessionStatusEnum.Completed, labelKey: 'workouts.sessions.statusFilters.completed' },
  { key: WorkoutSessionStatusEnum.Abandoned, labelKey: 'workouts.sessions.statusFilters.abandoned' },
];

const SessionsHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<WorkoutSessionStatusEnum | 'All'>('All');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetSessionsQuery({
    status: statusFilter === 'All' ? undefined : statusFilter,
    page,
    pageSize: 20,
  });

  if (isLoading) {
    return <Loader message={t('workouts.sessions.fetchingHistory')} />;
  }

  const items = data?.items ?? [];
  const hasNextPage = data ? data.page < data.totalPages : false;
  const hasPreviousPage = data ? data.page > 1 : false;

  return (
    <View className="flex-1 bg-white" testID="workouts-sessions-history-screen">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-primary mb-3">{t('workouts.sessions.historyTitle')}</Text>
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          {STATUS_TABS.map(tab => {
            const active = statusFilter === tab.key;
            return (
              <ToggleTab
                key={tab.key}
                active={active}
                onPress={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                }}
              >
                <Text className={`text-xs font-bold ${active ? ACTIVE_TEXT_CLASS : 'text-gray-500'}`}>{t(tab.labelKey)}</Text>
              </ToggleTab>
            );
          })}
        </View>
      </View>

      <FlatList
        className="flex-1 mt-2"
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <SessionSummaryItem session={item} onPress={() => router.push(`/(authorized)/workouts/sessions/${item.id}`)} />}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6">{t('workouts.sessions.noSessionsFound')}</Text>}
        ListFooterComponent={
          hasNextPage || hasPreviousPage ? (
            <View className="flex-row justify-center items-center gap-6 py-4">
              <TouchableOpacity onPress={() => setPage(prev => prev - 1)} disabled={!hasPreviousPage || isFetching}>
                <Text className={`font-semibold ${hasPreviousPage ? ACTIVE_TEXT_CLASS : 'text-gray-300'}`}>
                  {t('workouts.sessions.previousPage')}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-400 text-xs">
                {data?.page} / {data?.totalPages}
              </Text>
              <TouchableOpacity onPress={() => setPage(prev => prev + 1)} disabled={!hasNextPage || isFetching}>
                <Text className={`font-semibold ${hasNextPage ? ACTIVE_TEXT_CLASS : 'text-gray-300'}`}>{t('workouts.sessions.nextPage')}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SessionsHistoryScreen;
