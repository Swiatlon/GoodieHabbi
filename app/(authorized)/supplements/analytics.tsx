import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import EmptyState from '@/components/shared/empty-state/empty-state';
import KpiCard from '@/components/shared/kpi-card/kpi-card';
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

  const rateLabel = report.rate == null ? t('supplements.analytics.noData') : `${Math.round(report.rate)}%`;

  return (
    <View className="flex-1 bg-gray-50" testID="supplements-analytics-screen">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text className="text-2xl font-bold text-primary">{t('supplements.analytics.title')}</Text>
        <Text className="text-xs text-gray-400 mt-0.5 mb-3">{t('supplements.analytics.rangeLabel', { days: RANGE_DAYS })}</Text>

        <View className="flex-row gap-2 mb-4">
          <KpiCard label={t('supplements.analytics.kpiRateLabel')} value={rateLabel} icon="checkmark-circle-outline" color="#10B981" />
          <KpiCard label={t('supplements.analytics.kpiTakenLabel')} value={String(report.taken)} icon="checkbox-outline" color="#1987EE" />
          <KpiCard label={t('supplements.analytics.kpiScheduledLabel')} value={String(report.scheduled)} icon="calendar-outline" color="#6b7280" />
        </View>

        {report.items.length === 0 ? (
          <EmptyState icon="stats-chart-outline" message={t('supplements.analytics.noSupplements')} testID="analytics-empty-state" />
        ) : (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {report.items.map((item, idx) => (
              <View key={item.supplementId} className={idx < report.items.length - 1 ? 'border-b border-gray-50' : ''}>
                <AdherenceItem item={item} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SupplementAnalyticsScreen;
