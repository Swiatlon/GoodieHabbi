import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useBaseQuestSchema } from '../../reusable/schema/schema';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';

export interface IMonthlyQuestFormValues extends Omit<IMonthlyQuest, 'id' | 'startDay' | 'endDay'> {
  startDay: number | null;
  endDay: number | null;
}

export const useMonthlyQuestValidationSchema = () => {
  const { t } = useTranslation();
  const baseQuestSchema = useBaseQuestSchema();

  return baseQuestSchema.shape({
    startDay: Yup.number()
      .integer(t('quests.monthly.schema.startDayInteger'))
      .min(1, t('quests.monthly.schema.startDayMin'))
      .max(31, t('quests.monthly.schema.startDayMax'))
      .required(t('quests.monthly.schema.startDayRequired')),
    endDay: Yup.number()
      .integer(t('quests.monthly.schema.endDayInteger'))
      .min(1, t('quests.monthly.schema.endDayMin'))
      .max(31, t('quests.monthly.schema.endDayMax'))
      .required(t('quests.monthly.schema.endDayRequired'))
      .test('is-greater', t('quests.monthly.schema.endDayGreater'), function (value) {
        const { startDay } = this.parent as { startDay?: number };

        if (startDay === undefined) {
          return true;
        }

        return value >= startDay;
      }),
  });
};
