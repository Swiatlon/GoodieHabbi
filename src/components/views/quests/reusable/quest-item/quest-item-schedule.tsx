import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import QuestItemSeason from './quest-item-season';
import QuestItemDateWeekly from './quest-item-weekly';
import { IQuestSchedule, IQuestTarget, PeriodUnitEnum } from '@/contract/quests/quest.contract';
import { formatAmount, formatMonthDay, seasonFromYearWindow } from '@/utils/quests/schedule';

interface QuestItemScheduleProps {
  schedule: IQuestSchedule;
  target: IQuestTarget;
  /** Passed through to the weekday chips, which scroll and need the row's own tap handler. */
  onPress?: () => void;
}

/**
 * The recurrence in one line, replacing the three badges the typed model needed (weekdays, month range,
 * season). Weekdays and seasons keep their own richer renderers; everything else is a sentence.
 *
 * A quest whose target is "twice a week" has a Week schedule with `amount: 2` — the repetition count
 * lives in the target, not the schedule, so the sentence has to read both to describe the habit.
 */
const QuestItemSchedule: React.FC<QuestItemScheduleProps> = ({ schedule, target, onPress }) => {
  const { t } = useTranslation();

  if (schedule.unit === PeriodUnitEnum.DAY && schedule.interval <= 1 && schedule.weekdays && schedule.weekdays.length > 0) {
    return <QuestItemDateWeekly weekdays={schedule.weekdays} onPress={onPress} />;
  }

  if (schedule.unit === PeriodUnitEnum.YEAR) {
    const season = seasonFromYearWindow(schedule.yearWindowStart, schedule.yearWindowEnd);

    if (season) {
      return <QuestItemSeason season={season} />;
    }
  }

  const describeRecurrence = (): string => {
    switch (schedule.unit) {
      case PeriodUnitEnum.NONE:
        return t('quests.reusable.schedule.once');

      case PeriodUnitEnum.DAY:
        return schedule.interval > 1 ? t('quests.reusable.schedule.everyNDays', { count: schedule.interval }) : t('quests.reusable.schedule.daily');

      case PeriodUnitEnum.WEEK:
        // With a unit the number means "how much" (15 km), without one it means "how many days".
        return target.unit
          ? t('quests.reusable.schedule.unitsPerWeek', { amount: formatAmount(target.amount), unit: target.unit })
          : t('quests.reusable.schedule.timesPerWeek', { count: target.amount });

      case PeriodUnitEnum.MONTH:
        if (schedule.monthWindowStartDay !== null && schedule.monthWindowEndDay !== null) {
          return t('quests.reusable.schedule.monthWindow', { start: schedule.monthWindowStartDay, end: schedule.monthWindowEndDay });
        }

        return target.unit
          ? t('quests.reusable.schedule.unitsPerMonth', { amount: formatAmount(target.amount), unit: target.unit })
          : t('quests.reusable.schedule.timesPerMonth', { count: target.amount });

      case PeriodUnitEnum.YEAR:
      default:
        return schedule.yearWindowStart !== null && schedule.yearWindowEnd !== null
          ? t('quests.reusable.schedule.yearWindow', {
              start: formatMonthDay(schedule.yearWindowStart),
              end: formatMonthDay(schedule.yearWindowEnd),
            })
          : t('quests.reusable.schedule.yearly');
    }
  };

  /**
   * A period longer than a day can also repeat every N of them, and that is not visible anywhere in the
   * sentence above — "3× a week" reads the same whether the week comes round every week or every other.
   */
  const describeInterval = (): string | null => {
    if (schedule.interval <= 1) return null;

    switch (schedule.unit) {
      case PeriodUnitEnum.WEEK:
        return t('quests.reusable.schedule.everyNWeeks', { count: schedule.interval });
      case PeriodUnitEnum.MONTH:
        return t('quests.reusable.schedule.everyNMonths', { count: schedule.interval });
      case PeriodUnitEnum.YEAR:
        return t('quests.reusable.schedule.everyNYears', { count: schedule.interval });
      default:
        // Day intervals are already spelled out by `everyNDays` in the sentence itself.
        return null;
    }
  };

  /**
   * The Week and Month sentences already carry their own number, so repeating the target there would
   * read as "2× a week · 2×". Everywhere else the target is genuinely extra information.
   */
  const countedInRecurrence =
    schedule.unit === PeriodUnitEnum.WEEK || (schedule.unit === PeriodUnitEnum.MONTH && schedule.monthWindowStartDay === null);

  const describeTarget = (): string | null => {
    if (countedInRecurrence) return null;

    if (target.unit) {
      return t('quests.reusable.schedule.targetSuffix', { amount: formatAmount(target.amount), unit: target.unit });
    }

    return target.amount > 1 ? t('quests.reusable.schedule.targetTimes', { count: target.amount }) : null;
  };

  const targetLabel = describeTarget();
  const intervalLabel = describeInterval();

  return (
    <View className="flex-row items-center flex-wrap gap-x-2">
      <Text className="text-sm text-gray-600">🔁 {describeRecurrence()}</Text>
      {intervalLabel && <Text className="text-sm text-gray-500">· {intervalLabel}</Text>}
      {targetLabel && <Text className="text-sm font-bold text-gray-700">· {targetLabel}</Text>}
    </View>
  );
};

export default QuestItemSchedule;
