import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import dayjs from '@/configs/day-js-config';
import { DifficultyEnumType, PriorityEnumType } from '@/contract/quests/base-quests';

export const useBaseQuestSchema = () => {
  const { t } = useTranslation();

  return Yup.object().shape({
    title: Yup.string().required(t('quests.reusable.schema.titleRequired')).min(3, t('quests.reusable.schema.titleMinLength')),
    description: Yup.string().nullable().default(''),
    startDate: Yup.string()
      .nullable()
      .test('is-not-less-than-allowed', t('quests.reusable.schema.startDateInvalid'), function (value) {
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
      .test('is-after-or-equal-start', t('quests.reusable.schema.endDateInvalid'), function (value) {
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
          id: Yup.number().required(t('quests.reusable.schema.tagIdRequired')),
          value: Yup.string().trim().required(t('quests.reusable.schema.tagRequired')).max(25, t('quests.reusable.schema.tagTooLong')),
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
};
