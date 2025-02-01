import dayjs from 'dayjs';
import * as Yup from 'yup';
import { PriorityEnumType, RepeatIntervalEnum, RepeatIntervalEnumType } from '@/contract/quest';

export interface DailyQuestFormValues {
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: PriorityEnumType | null;
  isCompleted: boolean;
  emoji: string | null;
  repeatInterval: {
    type: RepeatIntervalEnumType;
  };
}

export const dailyQuestValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: Yup.string().nullable().default(''),
  startDate: Yup.string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'Start date must be a valid ISO 8601 string')
    .default(null),
  endDate: Yup.string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'End date must be a valid ISO 8601 string')
    .test('is-after-or-equal-start', 'End date must be after or equal to start date', function (value) {
      const startDate = this.resolve(Yup.ref('startDate')) as string;

      if (!startDate || !value) {
        return true;
      }

      const start = dayjs.utc(startDate);
      const end = dayjs.utc(value);

      return end.isAfter(start) || end.isSame(start);
    })
    .default(null),
  priority: Yup.mixed<PriorityEnumType>().nullable().default(null),
  isCompleted: Yup.boolean().default(false),
  emoji: Yup.string().nullable().default(null),
  repeatInterval: Yup.object().shape({
    type: Yup.string().oneOf(Object.values(RepeatIntervalEnum)).required(),
  }),
});
