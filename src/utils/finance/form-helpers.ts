import dayjs from '@/configs/day-js-config';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const todayString = () => dayjs().format(DATE_FORMAT);

export const parseAmount = (value: string) => parseFloat(value.replace(',', '.'));

// Keeps the same day-of-month, clamped into the target month (e.g. the 31st copied into a 30-day month lands on the 30th).
export const remapOccurredOnToMonth = (occurredOn: string, targetYear: number, targetMonth: number) => {
  const day = dayjs(occurredOn).date();
  const targetMonthStart = dayjs()
    .year(targetYear)
    .month(targetMonth - 1)
    .date(1);
  const clampedDay = Math.min(day, targetMonthStart.endOf('month').date());
  return targetMonthStart.date(clampedDay).format(DATE_FORMAT);
};
