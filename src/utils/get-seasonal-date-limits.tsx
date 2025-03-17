import dayjs from '@/configs/day-js-config';
import { SeasonEnum, SeasonEnumType } from '@/contract/quests/base-quests';
import { toUTCISOString } from '@/utils/utils';

const getSeasonDateRange = (season: SeasonEnumType | null) => {
  const today = dayjs.utc();
  const year = today.year();

  let winterStart, winterEnd;

  if (today.isAfter(dayjs.utc(`${year}-03-20`))) {
    winterStart = `${year}-12-21`;
    winterEnd = `${year + 1}-03-20`;
  } else {
    winterStart = `${year - 1}-12-21`;
    winterEnd = `${year}-03-20`;
  }

  const seasonRanges = {
    [SeasonEnum.WINTER]: { start: winterStart, end: winterEnd },
    [SeasonEnum.SPRING]: { start: `${year}-03-21`, end: `${year}-06-20` },
    [SeasonEnum.SUMMER]: { start: `${year}-06-21`, end: `${year}-09-22` },
    [SeasonEnum.AUTUMN]: { start: `${year}-09-23`, end: `${year}-12-20` },
  };

  if (!season) {
    return null;
  }

  return {
    start: dayjs.utc(seasonRanges[season].start),
    end: dayjs.utc(seasonRanges[season].end),
  };
};

const formatDate = (date: dayjs.Dayjs | string | null | undefined) => (date ? toUTCISOString(date) : null);

export const getSeasonalDateLimits = (selectedSeason: SeasonEnumType | null, startDate: string | null | undefined) => {
  const seasonDates = getSeasonDateRange(selectedSeason);
  const today = dayjs.utc();

  return {
    minStartDate: formatDate(seasonDates?.start.isAfter(today) ? seasonDates.start : today),
    minEndDate: formatDate(startDate || today),
    maxStartDate: formatDate(seasonDates?.end),
    maxEndDate: formatDate(seasonDates?.end),
  };
};
