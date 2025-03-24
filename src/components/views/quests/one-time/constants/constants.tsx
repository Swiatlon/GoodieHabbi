import { IFilterMapValues } from '../../../../shared/config-modal/filter-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';

export const OneTimeQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IOneTimeQuest>>>;
