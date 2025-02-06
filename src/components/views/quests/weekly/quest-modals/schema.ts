import * as Yup from 'yup';
import { baseQuestSchema } from '../../reusable/schema/schema';
import { WeekdayEnum, WeekdayEnumType } from '@/contract/quests/base-quests';

const validWeekdays = Object.values(WeekdayEnum);

export const weeklyQuestValidationSchema = baseQuestSchema.shape({
  weekdays: Yup.array()
    .of(Yup.mixed<WeekdayEnumType>().oneOf(validWeekdays).required())
    .min(1, 'At least one weekday is required')
    .required('Weekdays are required'),
});
