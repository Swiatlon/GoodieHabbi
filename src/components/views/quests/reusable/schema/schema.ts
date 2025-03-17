import * as Yup from 'yup';
import dayjs from '@/configs/day-js-config';
import { PriorityEnumType } from '@/contract/quests/base-quests';

export const baseQuestSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: Yup.string().nullable().default(''),
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
    .default(null),
  endDate: Yup.string()
    .nullable()
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
  labels: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('ID is required'),
        value: Yup.string().trim().required('Tag cannot be empty').max(25, 'Tag is too long. Please keep it under 25 characters.'),
        backgroundColor: Yup.string().default('#1987EE'),
        textColor: Yup.string().default('#FFFFFF'),
      })
    )
    .default([]),
  emoji: Yup.string().nullable().default(null),
});
