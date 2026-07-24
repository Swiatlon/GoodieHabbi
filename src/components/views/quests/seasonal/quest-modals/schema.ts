import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useBaseQuestSchema } from '../../reusable/schema/schema';
import { SeasonEnumType } from '@/contract/quests/base-quests';
import { getSeasonalDateLimits } from '@/utils/get-seasonal-date-limits';
import { safeDateFormat } from '@/utils/utils/utils';

interface Parent {
  season: SeasonEnumType | null;
  startDate: string | null;
  endDate: string | null;
}

export const useSeasonalQuestSchema = () => {
  const { t } = useTranslation();
  const baseQuestSchema = useBaseQuestSchema();

  return baseQuestSchema.shape({
    season: Yup.mixed<SeasonEnumType>().nullable().defined(t('quests.seasonal.schema.seasonRequired')),
    startDate: Yup.string()
      .nullable()
      .test('is-not-less-than-today', t('quests.seasonal.schema.startDateFuture'), function (value) {
        if (!value) {
          return true;
        }

        const today = dayjs.utc().startOf('day');
        const startDate = dayjs(value);

        return startDate.isSameOrAfter(today, 'day');
      })
      .test('is-within-season', t('quests.seasonal.schema.startDateWithinSeason'), function (value) {
        const { season } = this.parent as Parent;

        if (!season || !value) {
          return true;
        }

        const seasonDates = getSeasonalDateLimits(season, value);
        const isValid = dayjs(value).isBetween(seasonDates.minStartDate, seasonDates.maxStartDate, 'day', '[]');

        return (
          isValid ||
          this.createError({
            message: t('quests.seasonal.schema.startDateRangeDetail', {
              min: safeDateFormat(seasonDates.minStartDate),
              max: safeDateFormat(seasonDates.maxStartDate),
            }),
            path: 'startDate',
          })
        );
      })
      .default(null),

    endDate: Yup.string()
      .nullable()
      .test('is-within-season', t('quests.seasonal.schema.endDateWithinSeason'), function (value) {
        const { season, startDate } = this.parent as Parent;

        if (!season || !value) {
          return true;
        }

        const seasonDates = getSeasonalDateLimits(season, startDate);
        const isValid = dayjs(value).isBetween(seasonDates.minEndDate, seasonDates.maxEndDate, 'day', '[]');

        return (
          isValid ||
          this.createError({
            message: t('quests.seasonal.schema.endDateRangeDetail', {
              min: safeDateFormat(seasonDates.minEndDate),
              max: safeDateFormat(seasonDates.maxEndDate),
            }),
            path: 'endDate',
          })
        );
      })
      .test('is-after-or-equal-start', t('quests.seasonal.schema.endDateAfterStart'), function (value) {
        const { startDate } = this.parent as Parent;

        if (!startDate || !value) {
          return true;
        }

        const isValid = dayjs(value).isSameOrAfter(dayjs(startDate));

        return (
          isValid ||
          this.createError({
            message: t('quests.seasonal.schema.endDateAfterStartDetail', { startDate: safeDateFormat(startDate) }),
            path: 'endDate',
          })
        );
      })
      .default(null),
  });
};
