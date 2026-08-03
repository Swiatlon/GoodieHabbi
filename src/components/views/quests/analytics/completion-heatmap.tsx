import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native';
import dayjs from '@/configs/day-js-config';
import { IQuestCalendarEntry, QuestPeriodOutcomeEnum } from '@/contract/quests/analytics/quests-analytics.contract';
import { buildDayOutcomeMap, buildHeatmapWeeks, OUTCOME_COLORS, UNSCHEDULED_COLOR } from '@/utils/quests/analytics';

const CELL_SIZE = 15;
const CELL_GAP = 3;
const WEEKDAY_LABEL_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface CompletionHeatmapProps {
  calendar: IQuestCalendarEntry[];
  from: string;
  to: string;
}

const CompletionHeatmap: React.FC<CompletionHeatmapProps> = ({ calendar, from, to }) => {
  const { t } = useTranslation();

  const byDay = useMemo(() => buildDayOutcomeMap(calendar), [calendar]);
  const weeks = useMemo(() => buildHeatmapWeeks(from, to), [from, to]);

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4">
      <Text className="text-sm font-bold text-gray-800 mb-3">{t('quests.analytics.heatmap.heading')}</Text>

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
                  // A day with no entry was simply never scheduled — it must never read as a miss.
                  const entry = day ? byDay.get(day) : undefined;
                  const backgroundColor = entry ? OUTCOME_COLORS[entry.outcome] : UNSCHEDULED_COLOR;
                  const isBackfilled = entry?.outcome === QuestPeriodOutcomeEnum.COMPLETED && entry.isBackfilled;

                  return (
                    <View
                      key={day ?? `empty-${week.key}-${index}`}
                      style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor, opacity: day ? 1 : 0 }}
                      className="rounded items-center justify-center"
                      accessibilityLabel={
                        day
                          ? `${dayjs(day).format('DD.MM.YYYY')} — ${t(
                              entry ? `quests.analytics.outcome.${entry.outcome.toLowerCase()}` : 'quests.analytics.outcome.unscheduled'
                            )}`
                          : undefined
                      }
                    >
                      {isBackfilled && <View className="w-1 h-1 rounded-full bg-white" />}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text className="text-[10px] text-gray-400 mt-3">{t('quests.analytics.heatmap.hint')}</Text>
    </View>
  );
};

export default CompletionHeatmap;
