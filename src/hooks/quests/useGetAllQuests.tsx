import UpdateDailyQuestModal from '@/components/views/quests/daily/quest-modals/update-daily-quest-modal';
import UpdateMonthlyQuestModal from '@/components/views/quests/monthly/quest-modals/update-monthly-quest-modal';
import UpdateOneTimeQuestModal from '@/components/views/quests/one-time/quest-modals/update-one-time-quest-modal';
import UpdateSeasonalQuestModal from '@/components/views/quests/seasonal/quest-modals/update-seasonal-quest-modal';
import UpdateWeeklyQuestModal from '@/components/views/quests/weekly/quest-modals/update-weekly-quest-modal';
import { QuestTypesEnum, QuestTypesEnumType } from '@/contract/quests/base-quests';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { IOneTimeQuest } from '@/contract/quests/quests-types/one-time-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { useDeleteDailyQuestMutation, useGetAllDailyQuestsQuery, usePatchDailyQuestMutation } from '@/redux/api/daily-quests-api';
import { useDeleteMonthlyQuestMutation, useGetAllMonthlyQuestsQuery, usePatchMonthlyQuestMutation } from '@/redux/api/monthly-quests-api';
import { useDeleteOneTimeQuestMutation, useGetAllOneTimeQuestsQuery, usePatchOneTimeQuestMutation } from '@/redux/api/one-time-quests-api';
import { useDeleteSeasonalQuestMutation, useGetAllSeasonalQuestsQuery, usePatchSeasonalQuestMutation } from '@/redux/api/seasonal-quests-api';
import { useDeleteWeeklyQuestMutation, useGetAllWeeklyQuestsQuery, usePatchWeeklyQuestMutation } from '@/redux/api/weekly-quests-api';

export type AllQuestsUnion = IOneTimeQuest | IMonthlyQuest | ISeasonalQuest | IDailyQuest | IWeeklyQuest;

export const useGetAllQuests = () => {
  const { data: oneTimeQuests = [], isLoading: loadingOneTime, error: errorOneTime } = useGetAllOneTimeQuestsQuery();
  const { data: monthlyQuests = [], isLoading: loadingMonthly, error: errorMonthly } = useGetAllMonthlyQuestsQuery();
  const { data: seasonalQuests = [], isLoading: loadingSeasonal, error: errorSeasonal } = useGetAllSeasonalQuestsQuery();
  const { data: dailyQuests = [], isLoading: loadingDaily, error: errorDaily } = useGetAllDailyQuestsQuery();
  const { data: weeklyQuests = [], isLoading: loadingWeekly, error: errorWeekly } = useGetAllWeeklyQuestsQuery();

  const isLoading = loadingOneTime || loadingMonthly || loadingSeasonal || loadingDaily || loadingWeekly;
  const error = errorOneTime || errorMonthly || errorSeasonal || errorDaily || errorWeekly;

  const allQuests: AllQuestsUnion[] = [...oneTimeQuests, ...monthlyQuests, ...seasonalQuests, ...dailyQuests, ...weeklyQuests];

  return { data: allQuests, isLoading, error };
};

const QuestRegistry = {
  [QuestTypesEnum.ONE_TIME]: {
    patchQuest: usePatchOneTimeQuestMutation,
    deleteQuest: useDeleteOneTimeQuestMutation,
    updateModal: UpdateOneTimeQuestModal,
  },
  [QuestTypesEnum.SEASONAL]: {
    patchQuest: usePatchSeasonalQuestMutation,
    deleteQuest: useDeleteSeasonalQuestMutation,
    updateModal: UpdateSeasonalQuestModal,
  },
  [QuestTypesEnum.MONTHLY]: {
    patchQuest: usePatchMonthlyQuestMutation,
    deleteQuest: useDeleteMonthlyQuestMutation,
    updateModal: UpdateMonthlyQuestModal,
  },
  [QuestTypesEnum.DAILY]: {
    patchQuest: usePatchDailyQuestMutation,
    deleteQuest: useDeleteDailyQuestMutation,
    updateModal: UpdateDailyQuestModal,
  },
  [QuestTypesEnum.WEEKLY]: {
    patchQuest: usePatchWeeklyQuestMutation,
    deleteQuest: useDeleteWeeklyQuestMutation,
    updateModal: UpdateWeeklyQuestModal,
  },
};

export const useQuestMutations = (questType: QuestTypesEnumType) => {
  return QuestRegistry[questType];
};
