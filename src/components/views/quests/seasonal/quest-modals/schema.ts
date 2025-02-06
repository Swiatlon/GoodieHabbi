import * as Yup from 'yup';
import { baseQuestSchema } from '../../reusable/schema/schema';
import { SeasonEnumType } from '@/contract/quests/base-quests';

export const seasonalQuestValidationSchema = baseQuestSchema.shape({
  season: Yup.mixed<SeasonEnumType>().nullable().default(null),
});
