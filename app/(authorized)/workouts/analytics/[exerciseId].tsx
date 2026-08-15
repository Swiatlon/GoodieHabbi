import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loader from '@/components/shared/loader/loader';
import dayjs from '@/configs/day-js-config';
import { useGetExerciseHistoryQuery } from '@/redux/api/workouts/analytics-api';
import { useGetWorkoutSettingsQuery } from '@/redux/api/workouts/settings-api';
import { safeDateFormat, toIsoDate } from '@/utils/utils/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const RANGE_DAYS = 180;
const AXIS_LABEL_STYLE = { color: '#6b7280', fontSize: 10 };

const ExerciseHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const to = toIsoDate(new Date()) ?? '';
  const from = toIsoDate(dayjs().subtract(RANGE_DAYS, 'day').toDate()) ?? '';

  const { data: history, isLoading } = useGetExerciseHistoryQuery({ exerciseId: Number(exerciseId), from, to });
  const { data: settings } = useGetWorkoutSettingsQuery();
  const weightUnit = settings?.weightUnit ?? 'kg';

  if (isLoading || !history) {
    return <Loader message={t('workouts.analytics.fetching')} />;
  }

  const chartData = history.points
    .filter(point => point.bestEstimatedOneRepMax != null)
    .map(point => ({ value: point.bestEstimatedOneRepMax as number, label: dayjs(point.performedOn).format('DD.MM') }));

  return (
    <View className="flex-1 bg-white" testID="workouts-exercise-history-screen">
      <View className="flex-row items-center px-2 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#4b465d" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-gray-800">{history.exerciseName}</Text>
        <View className="w-9" />
      </View>

      <FlatList
        data={history.points}
        keyExtractor={item => item.sessionId.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          chartData.length > 1 ? (
            <View className="p-4">
              <Text className="text-sm font-bold text-gray-800 mb-1">{t('workouts.analytics.oneRepMaxTrend')}</Text>
              <Text className="text-xs text-gray-400 mb-4">{t('workouts.analytics.rangeLabel', { days: RANGE_DAYS })}</Text>
              <LineChart
                data={chartData}
                width={CHART_WIDTH}
                height={120}
                curved
                color="#1987EE"
                thickness={2.5}
                dataPointsColor="#1987EE"
                dataPointsRadius={4}
                noOfSections={3}
                yAxisTextStyle={AXIS_LABEL_STYLE}
                formatYLabel={value => `${Math.round(Number(value))}`}
                xAxisLabelTextStyle={AXIS_LABEL_STYLE}
                hideRules
                isAnimated
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <Text className="text-sm text-gray-700">{safeDateFormat(item.performedOn)}</Text>
            <Text className="text-xs text-gray-400">
              {item.setCount} {t('workouts.sessions.totals.sets')} · {item.totalVolume} {weightUnit}
              {item.bestEstimatedOneRepMax != null && ` · 1RM ≈ ${Math.round(item.bestEstimatedOneRepMax)} ${weightUnit}`}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6 px-4">{t('workouts.analytics.noHistory')}</Text>}
      />
    </View>
  );
};

export default ExerciseHistoryScreen;
