import { DateType } from 'react-native-ui-datepicker';
import dayjs from '@/configs/day-js-config';
import { NullableString, UndefinedString } from '@/types/global-types';

export const safeDateFormat = (date: NullableString, format = 'DD.MM.YYYY'): UndefinedString => {
  return date ? dayjs(date).format(format) : undefined;
};

export const toUTCISOString = (date: DateType) => {
  return date ? dayjs.utc(date).toISOString() : null;
};

export const fromUTCToLocal = (date: NullableString) => {
  return date ? dayjs(date).local().toISOString() : null;
};

export const fromUTCToDateObject = (date: NullableString) => {
  return date ? dayjs.utc(date).toDate() : null;
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

  return yiq >= 137 ? 'black' : 'white';
}
