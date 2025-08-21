import * as Yup from 'yup';
import dayjs from '@/configs/day-js-config';
import { DifficultyEnumType, PriorityEnumType } from '@/contract/quests/base-quests';

export const baseQuestSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: Yup.string().nullable().default(''),
  startDate: Yup.string()
    .nullable()
    .test('is-not-less-than-allowed', 'Start date is invalid', function (value) {
      const { initialStartDate } = this.options.context || {};

      if (!value) return true;

      const inputDate = dayjs(value).startOf('day');
      const today = dayjs().startOf('day');

      let minDate = today;

      if (initialStartDate) {
        const initial = dayjs(initialStartDate).startOf('day');

        if (initial.isBefore(today)) {
          minDate = initial;
        }
      }

      return inputDate.isSameOrAfter(minDate, 'day');
    })
    .default(null),
  endDate: Yup.string()
    .nullable()
    .test('is-after-or-equal-start', 'End date must be after or equal to start date', function (value) {
      const startDate = this.resolve(Yup.ref('startDate')) as string;

      if (!startDate || !value) {
        return true;
      }

      const start = dayjs(startDate).local();
      const end = dayjs(value).local();

      return end.isSameOrAfter(start, 'day');
    })
    .default(null),
  priority: Yup.mixed<PriorityEnumType>()
    .transform((value: PriorityEnumType | null, originalValue: unknown): PriorityEnumType | null => (originalValue === '' ? null : value))
    .nullable()
    .default(null),
  isCompleted: Yup.boolean().default(false),
  labels: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required('ID is required'),
        value: Yup.string().trim().required('Tag cannot be empty').max(25, 'Tag is too long. Please keep it under 25 characters.'),
        backgroundColor: Yup.string().default('#1987EE'),
      })
    )
    .default([]),
  emoji: Yup.string().nullable().default(null),
  difficulty: Yup.mixed<DifficultyEnumType>()
    .transform((value: DifficultyEnumType | null, originalValue: unknown): DifficultyEnumType | null => (originalValue === '' ? null : value))
    .nullable()
    .default(null),
  scheduledTime: Yup.string().nullable().default(null),
});
