import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useBaseQuestSchema } from '../../reusable/schema/schema';
import { WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';

const validWeekdays = Object.values(WeekdayEnum);

export const useWeeklyQuestValidationSchema = () => {
  const { t } = useTranslation();
  const baseQuestSchema = useBaseQuestSchema();

  return baseQuestSchema.shape({
    weekdays: Yup.array()
      .of(Yup.mixed<WeekdayEnumType>().oneOf(validWeekdays).required())
      .min(1, t('quests.weekly.schema.weekdaysMin'))
      .required(t('quests.weekly.schema.weekdaysRequired')),
  });
};
