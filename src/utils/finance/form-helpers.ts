import dayjs from '@/configs/day-js-config';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const todayString = () => dayjs().format(DATE_FORMAT);

export const parseAmount = (value: string) => parseFloat(value.replace(',', '.'));
