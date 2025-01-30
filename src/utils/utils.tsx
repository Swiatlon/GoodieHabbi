import { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { NullableString } from '@/types/global-types';

export const safeDateFormat = (date: NullableString, format = 'DD.MM.YYYY'): NullableString => {
  return date ? dayjs(date).format(format) : null;
};

export const toUTCISOString = (date: DateType) => {
  return date ? dayjs.utc(date).toISOString() : undefined;
};

export const fromUTCToLocal = (date: NullableString) => {
  return date ? dayjs.utc(date).local().format('DD.MM.YYYY') : undefined;
};

export const fromUTCToDateObject = (date: NullableString) => {
  return date ? dayjs.utc(date).toDate() : undefined;
};
