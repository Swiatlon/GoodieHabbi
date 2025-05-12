import dayjs from 'dayjs';
import * as Yup from 'yup';
import { baseQuestSchema } from '../../reusable/schema/schema';
import { SeasonEnumType } from '@/contract/quests/base-quests';
import { getSeasonalDateLimits } from '@/utils/get-seasonal-date-limits';
import { safeDateFormat } from '@/utils/utils';

interface Parent {
  season: SeasonEnumType | null;
  startDate: string | null;
  endDate: string | null;
}

export const seasonalQuestValidationSchema = baseQuestSchema.shape({
  season: Yup.mixed<SeasonEnumType>().nullable().defined('Season is required'),
  startDate: Yup.string()
    .nullable()
    .test('is-not-less-than-today', 'Start date must be today or in the future', function (value) {
      if (!value) {
        return true;
      }

      const today = dayjs.utc().startOf('day');
      const startDate = dayjs(value);

      return startDate.isSameOrAfter(today, 'day');
    })
    .test('is-within-season', 'Start date must be within the valid season range', function (value) {
      const { season } = this.parent as Parent;

      if (!season || !value) {
        return true;
      }

      const seasonDates = getSeasonalDateLimits(season, value);
      const isValid = dayjs(value).isBetween(seasonDates.minStartDate, seasonDates.maxStartDate, 'day', '[]');

      return (
        isValid ||
        this.createError({
          message: `Start date must be within the season range: ${safeDateFormat(seasonDates.minStartDate)} to ${safeDateFormat(seasonDates.maxStartDate)}`,
          path: 'startDate',
        })
      );
    })
    .default(null),

  endDate: Yup.string()
    .nullable()
    .test('is-within-season', 'End date must be within the valid season range', function (value) {
      const { season, startDate } = this.parent as Parent;

      if (!season || !value) {
        return true;
      }

      const seasonDates = getSeasonalDateLimits(season, startDate);
      const isValid = dayjs(value).isBetween(seasonDates.minEndDate, seasonDates.maxEndDate, 'day', '[]');

      return (
        isValid ||
        this.createError({
          message: `End date must be within the season range: ${safeDateFormat(seasonDates.minEndDate)} to ${safeDateFormat(seasonDates.maxEndDate)}`,
          path: 'endDate',
        })
      );
    })
    .test('is-after-or-equal-start', 'End date must be after or equal to start date', function (value) {
      const { startDate } = this.parent as Parent;

      if (!startDate || !value) {
        return true;
      }

      const isValid = dayjs(value).isSameOrAfter(dayjs(startDate));

      return (
        isValid ||
        this.createError({
          message: `End date must be on or after the start date: ${safeDateFormat(startDate)}`,
          path: 'endDate',
        })
      );
    })
    .default(null),
});
