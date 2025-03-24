import { IFilterMapValues } from '../../../../shared/config-modal/filter-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

export const TodayQuestsFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<AllQuestsUnion>>>;
