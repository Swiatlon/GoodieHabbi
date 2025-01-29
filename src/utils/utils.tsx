import moment from 'moment';
import { NullableString } from '@/types/global-types';

export const safeDateFormat = (date: NullableString, format = 'DD.MM.YYYY'): NullableString => {
  return date ? moment(date).format(format) : null;
};
