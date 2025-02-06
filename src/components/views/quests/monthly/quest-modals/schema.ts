import * as Yup from 'yup';
import { baseQuestSchema } from '../../reusable/schema/schema';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';

export interface IMonthlyQuestFormValues extends Omit<IMonthlyQuest, 'id' | 'startDay' | 'endDay'> {
  startDay: number | null;
  endDay: number | null;
}

export const monthlyQuestValidationSchema = baseQuestSchema.shape({
  startDay: Yup.number()
    .integer('Start day must be an integer')
    .min(1, 'Start day must be at least 1')
    .max(31, 'Start day cannot be more than 31')
    .nullable()
    .required('Start day is required'),
  endDay: Yup.number()
    .integer('End day must be an integer')
    .min(1, 'End day must be at least 1')
    .max(31, 'End day cannot be more than 31')
    .nullable()
    .required('End day is required')
    .test('is-greater', 'End day must be greater than or equal to start day', function (value) {
      const parent = this.parent as { startDay?: number };

      if (!parent.startDay) {
        return true;
      }

      return value >= parent.startDay;
    }),
});
