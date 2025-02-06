import { IFilterMapValues } from '../../reusable/config-modal/config-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';

export const OneTimeQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IOneTimeQuest>>>;
