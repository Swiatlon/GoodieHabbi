import { IFilterMapValues } from '../../reusable/config-modal/config-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';

export const DailyQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IDailyQuest>>>;
