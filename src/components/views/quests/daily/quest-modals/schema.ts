import { useBaseQuestSchema } from '../../reusable/schema/schema';

export const useDailyQuestValidationSchema = () => {
  const baseQuestSchema = useBaseQuestSchema();

  return baseQuestSchema.shape({});
};
