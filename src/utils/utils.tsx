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

export function getBestContrastTextColor(hexcolor: string) {
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1);
  }

  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex;
      })
      .join('');
  }

  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
}
