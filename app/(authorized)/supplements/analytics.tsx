import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import Loader from '@/components/shared/loader/loader';
import AdherenceItem from '@/components/views/supplements/analytics/adherence-item';
import dayjs from '@/configs/day-js-config';
import { useGetSupplementAdherenceQuery } from '@/redux/api/supplements/analytics-api';
import { toIsoDate } from '@/utils/utils/utils';

const RANGE_DAYS = 30;

const SupplementAnalyticsScreen: React.FC = () => {
  const { t } = useTranslation();
  const to = toIsoDate(new Date()) ?? '';
  const from = toIsoDate(dayjs().subtract(RANGE_DAYS, 'day').toDate()) ?? '';

  const { data: report, isLoading } = useGetSupplementAdherenceQuery({ from, to });

  if (isLoading || !report) {
    return <Loader message={t('supplements.analytics.fetching')} />;
  }

  return (
    <View className="flex-1 bg-white" testID="supplements-analytics-screen">
      <FlatList
        data={report.items}
        keyExtractor={item => item.supplementId.toString()}
        ListHeaderComponent={
          <View className="px-4 pt-4 gap-2">
            <Text className="text-2xl font-bold text-primary">{t('supplements.analytics.title')}</Text>
            <Text className="text-xs text-gray-400 -mt-1">{t('supplements.analytics.rangeLabel', { days: RANGE_DAYS })}</Text>

            <View className="bg-gray-50 rounded-xl p-3 items-center mt-2">
              <Text className="text-2xl font-bold text-gray-800">
                {report.rate == null ? t('supplements.analytics.noData') : `${Math.round(report.rate)}%`}
              </Text>
              <Text className="text-xs text-gray-400">
                {report.taken}/{report.scheduled} {t('supplements.analytics.doses')}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <AdherenceItem item={item} />}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-6 px-4">{t('supplements.analytics.noSupplements')}</Text>}
      />
    </View>
  );
};

export default SupplementAnalyticsScreen;
