import { useBaseQuestSchema } from '../../reusable/schema/schema';

export const useOneTimeQuestValidationSchema = () => {
  const baseQuestSchema = useBaseQuestSchema();

  return baseQuestSchema.shape({});
};
