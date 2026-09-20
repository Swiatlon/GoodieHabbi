import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { IQuestWeekdayBreakdown } from '@/contract/quests/analytics/quests-analytics.contract';
import { COMPLETION_COLOR, formatCompletionRate, WEEKDAY_ORDER } from '@/utils/quests/analytics';

interface WeekdayBreakdownProps {
  byWeekday: IQuestWeekdayBreakdown[];
}

/**
 * Two questions share this widget, and which one it answers depends on the schedule.
 *
 * When the quest pins weekdays (`daysScheduled` is a number), the honest question is "which days do I
 * let slip" — a rate of days done over days due. When it does not — "3× a week, any days" — there is no
 * such thing as a Tuesday the user owed, so the only truthful reading is raw activity: which days the
 * habit actually happens on, scaled against the busiest one.
 *
 * The counts come from the completion log rather than from periods, which is what makes the second case
 * work at all: the period is the week, but the doing happens on days.
 */
const WeekdayBreakdown: React.FC<WeekdayBreakdownProps> = ({ byWeekday }) => {
  const { t } = useTranslation();

  if (byWeekday.length === 0) {
    return null;
  }

  const rows = WEEKDAY_ORDER.map(weekday => byWeekday.find(item => item.weekday === weekday)).filter((item): item is IQuestWeekdayBreakdown =>
    Boolean(item)
  );

  const isScheduleBound = rows.some(row => row.daysScheduled !== null);
  // Raw counts need their own ceiling, or a habit done twice a week would fill every bar.
  const busiestDay = Math.max(...rows.map(row => row.completions), 1);

  const fillRatio = (row: IQuestWeekdayBreakdown): number => {
    if (row.daysScheduled === null) {
      return row.completions / busiestDay;
    }

    return row.daysScheduled === 0 ? 0 : row.daysWithActivity / row.daysScheduled;
  };

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4">
      <Text className="text-sm font-bold text-gray-800 mb-1">{t('quests.analytics.weekday.heading')}</Text>
      <Text className="text-[11px] text-gray-400 mb-4">
        {t(isScheduleBound ? 'quests.analytics.weekday.hint' : 'quests.analytics.weekday.hintActivity')}
      </Text>

      <View className="gap-3">
        {rows.map(row => {
          const ratio = fillRatio(row);

          return (
            <View key={row.weekday} className="flex-row items-center gap-3">
              <Text className="text-xs text-gray-500 w-8">{t(`quests.reusable.days.${row.weekday.toLowerCase()}`)}</Text>

              <View className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full rounded-full" style={{ width: `${Math.round(ratio * 100)}%`, backgroundColor: COMPLETION_COLOR }} />
              </View>

              {row.daysScheduled === null ? (
                <Text className="text-xs font-bold text-gray-700 w-14 text-right">{row.completions}</Text>
              ) : (
                <Text className="text-xs font-bold text-gray-700 w-10 text-right">
                  {formatCompletionRate(row.daysScheduled === 0 ? null : row.daysWithActivity / row.daysScheduled)}
                </Text>
              )}

              <Text className="text-[10px] text-gray-400 w-12 text-right">
                {row.daysScheduled === null
                  ? t('quests.analytics.weekday.completionsCount', { count: row.completions })
                  : t('quests.analytics.weekday.scheduledRatio', { done: row.daysWithActivity, scheduled: row.daysScheduled })}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeekdayBreakdown;
