import { IAllQuestsUnion } from '../../hooks/useGetAllQuests';
import { IFilterMapValues } from '../../reusable/config-modal/config-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';

export const AllQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IAllQuestsUnion>>>;
