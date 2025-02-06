import { IFilterMapValues } from '../../reusable/config-modal/config-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';

export const MonthlyQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IMonthlyQuest>>>;
