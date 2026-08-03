import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native';
import dayjs from '@/configs/day-js-config';
import { IDailyCompletionRate } from '@/contract/quests/analytics/quests-analytics.contract';
import { buildHeatmapWeeks, formatCompletionRate } from '@/utils/quests/analytics';

const CELL_SIZE = 15;
const CELL_GAP = 3;
const WEEKDAY_LABEL_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/**
 * Sequential ramp — a single hue, light to dark, because this cell encodes a magnitude ("how much
 * of the day got done"), not an identity. Steps are Tailwind's emerald scale, so lightness rises
 * monotonically with the rate.
 */
const RATE_STEPS = ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#059669'];

const stepFor = (rate: number | null) => {
  if (rate === null) return RATE_STEPS[0];

  return RATE_STEPS[Math.min(Math.floor(rate * RATE_STEPS.length), RATE_STEPS.length - 1)];
};

interface DailyRateHeatmapProps {
  dailyCompletionRate: IDailyCompletionRate[];
  from: string;
  to: string;
}

const DailyRateHeatmap: React.FC<DailyRateHeatmapProps> = ({ dailyCompletionRate, from, to }) => {
  const { t } = useTranslation();

  const byDate = useMemo(() => new Map(dailyCompletionRate.map(item => [item.date, item])), [dailyCompletionRate]);
  const weeks = useMemo(() => buildHeatmapWeeks(from, to), [from, to]);

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4">
      <Text className="text-sm font-bold text-gray-800">{t('quests.analytics.overview.dailyRateHeading')}</Text>
      <Text className="text-[11px] text-gray-400 mb-4">{t('quests.analytics.overview.dailyRateHint')}</Text>

      <View className="flex-row">
        <View style={{ gap: CELL_GAP, marginRight: 6 }}>
          {WEEKDAY_LABEL_KEYS.map(key => (
            <View key={key} style={{ height: CELL_SIZE }} className="justify-center">
              <Text className="text-[9px] text-gray-400">{t(`quests.reusable.days.${key}`)}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row" style={{ gap: CELL_GAP }}>
            {weeks.map(week => (
              <View key={week.key} style={{ gap: CELL_GAP }}>
                {week.days.map((day, index) => {
                  // Days with nothing due are omitted by the backend — they stay blank, outlined
                  // only, so an empty schedule never reads as a bad day.
                  const entry = day ? byDate.get(day) : undefined;

                  return (
                    <View
                      key={day ?? `empty-${week.key}-${index}`}
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: entry ? stepFor(entry.completionRate) : 'transparent',
                        borderWidth: entry ? 0 : 1,
                        borderColor: '#F3F4F6',
                        opacity: day ? 1 : 0,
                      }}
                      className="rounded"
                      accessibilityLabel={
                        day && entry ? `${dayjs(day).format('DD.MM.YYYY')} — ${formatCompletionRate(entry.completionRate)}` : undefined
                      }
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="flex-row items-center gap-1.5 mt-3">
        <Text className="text-[10px] text-gray-400">{t('quests.analytics.overview.scaleLess')}</Text>
        {RATE_STEPS.map(color => (
          <View key={color} className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
        ))}
        <Text className="text-[10px] text-gray-400">{t('quests.analytics.overview.scaleMore')}</Text>
      </View>
    </View>
  );
};

export default DailyRateHeatmap;
