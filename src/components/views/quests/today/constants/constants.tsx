import { IFilterMapValues } from '../../reusable/config-modal/config-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { ITodayQuest } from '@/contract/quests/quests-types/today-quests';

export const TodayQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<ITodayQuest>>>;
