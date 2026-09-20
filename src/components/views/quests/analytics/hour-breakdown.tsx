import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { IQuestHourBreakdown } from '@/contract/quests/analytics/quests-analytics.contract';
import { COMPLETION_COLOR } from '@/utils/quests/analytics';

interface HourBreakdownProps {
  byHourOfDay: IQuestHourBreakdown[];
}

/** Hours with no activity are omitted by the API, so the axis has to be rebuilt to stay a day. */
const HOURS_IN_DAY = 24;

/**
 * When in the day the habit actually happens, straight from the completion log and in the user's own
 * local time — the hour is snapshotted at the tap, so a trip abroad does not move last month's entries.
 *
 * This is the analytics that two separate "morning" and "evening" quests used to be needed for, now
 * available from one quest with a target of 2. Rows migrated from the old model carry no hour at all
 * and the backend leaves them out rather than guessing.
 */
const HourBreakdown: React.FC<HourBreakdownProps> = ({ byHourOfDay }) => {
  const { t } = useTranslation();

  if (byHourOfDay.length === 0) {
    return null;
  }

  const completionsByHour = new Map(byHourOfDay.map(entry => [entry.hour, entry.completions]));
  const busiestHour = Math.max(...byHourOfDay.map(entry => entry.completions), 1);

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4">
      <Text className="text-sm font-bold text-gray-800 mb-1">{t('quests.analytics.hour.heading')}</Text>
      <Text className="text-[11px] text-gray-400 mb-4">{t('quests.analytics.hour.hint')}</Text>

      <View className="flex-row items-end justify-between h-24 gap-0.5">
        {Array.from({ length: HOURS_IN_DAY }, (_, hour) => {
          const completions = completionsByHour.get(hour) ?? 0;
          // A floor of 2% keeps an empty hour visible as a baseline rather than vanishing.
          const heightPercent = completions === 0 ? 2 : Math.max(8, (completions / busiestHour) * 100);

          return (
            <View
              key={hour}
              className="flex-1 rounded-sm"
              style={{ height: `${heightPercent}%`, backgroundColor: completions === 0 ? '#E5E7EB' : COMPLETION_COLOR }}
            />
          );
        })}
      </View>

      <View className="flex-row justify-between mt-2">
        {[0, 6, 12, 18].map(hour => (
          <Text key={hour} className="text-[10px] text-gray-400">
            {t('quests.analytics.hour.hourLabel', { hour })}
          </Text>
        ))}
        <Text className="text-[10px] text-gray-400">{t('quests.analytics.hour.hourLabel', { hour: 23 })}</Text>
      </View>
    </View>
  );
};

export default HourBreakdown;
