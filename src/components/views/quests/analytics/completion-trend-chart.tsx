import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import dayjs from '@/configs/day-js-config';
import { AnalyticsGranularityEnum, AnalyticsGranularityEnumType, IQuestTrendBucket } from '@/contract/quests/analytics/quests-analytics.contract';
import { COMPLETION_COLOR, toRatePercent } from '@/utils/quests/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const AXIS_LABEL_STYLE = { color: '#6b7280', fontSize: 10 };
const EMPTY_BUCKET_COLOR = '#E5E7EB';

// A "DD.MM" label at font size 10 is ~30px wide, so the bar pitch has to clear that or the labels
// collide. The chart scrolls instead of squeezing, which keeps 90- and 365-day ranges readable.
const BAR_WIDTH = 18;
const BAR_SPACING = 16;
const LABEL_SLOT = BAR_WIDTH + BAR_SPACING;
/** Headroom so a 100% bar and its marker are not clipped by the top of the plot. */
const TOP_HEADROOM = 20;

interface CompletionTrendChartProps {
  trend: IQuestTrendBucket[];
  granularity: AnalyticsGranularityEnumType;
}

// Numeric formats only — dayjs has no locale configured, so "MMM" would print English month names
// into a Polish UI.
const bucketLabel = (bucket: IQuestTrendBucket, granularity: AnalyticsGranularityEnumType) => {
  const start = dayjs(bucket.bucketStart);

  return granularity === AnalyticsGranularityEnum.MONTH ? start.format('MM.YY') : start.format('DD.MM');
};

const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({ trend, granularity }) => {
  const { t } = useTranslation();

  if (trend.length === 0) {
    return null;
  }

  // A bucket with nothing evaluated is a gap in the schedule, not a 0% score — it gets a dash and
  // no bar rather than a bar sitting on the floor. Bars carry no value labels: the y axis already
  // reads the percentage, and a number over every bar just crowds the plot.
  const data = trend.map(bucket => ({
    value: toRatePercent(bucket.completionRate),
    label: bucketLabel(bucket, granularity),
    frontColor: bucket.completionRate === null ? EMPTY_BUCKET_COLOR : COMPLETION_COLOR,
    labelTextStyle: AXIS_LABEL_STYLE,
    topLabelComponent: bucket.completionRate === null ? () => <Text style={{ color: '#9ca3af', fontSize: 10, marginBottom: 2 }}>—</Text> : undefined,
  }));

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4">
      <Text className="text-sm font-bold text-gray-800">{t('quests.analytics.trend.heading')}</Text>
      <Text className="text-[11px] text-gray-400 mb-4">{t(`quests.analytics.trend.granularity.${granularity.toLowerCase()}`)}</Text>

      <BarChart
        data={data}
        barWidth={BAR_WIDTH}
        barBorderRadius={4}
        spacing={BAR_SPACING}
        initialSpacing={BAR_SPACING / 2}
        endSpacing={BAR_SPACING / 2}
        labelWidth={LABEL_SLOT}
        noOfSections={4}
        maxValue={100}
        overflowTop={TOP_HEADROOM}
        yAxisTextStyle={AXIS_LABEL_STYLE}
        xAxisLabelTextStyle={AXIS_LABEL_STYLE}
        formatYLabel={value => `${Math.round(Number(value))}%`}
        hideRules
        width={CHART_WIDTH}
        height={140}
        showScrollIndicator
        // The newest buckets matter most, so the chart opens on them rather than on ancient history.
        scrollToEnd
        isAnimated
      />

      <Text className="text-[10px] text-gray-400 mt-2">{t('quests.analytics.trend.hint')}</Text>
    </View>
  );
};

export default CompletionTrendChart;
