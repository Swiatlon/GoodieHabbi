import { IFilterMapValues } from '../../reusable/config-modal/filter-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';

export const WeeklyQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IWeeklyQuest>>>;
