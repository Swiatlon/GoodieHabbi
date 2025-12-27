// TODO: Maybe in future refactor to have one hook for recurring + all on prop.
import UpdateDailyQuestModal from '@/components/views/quests/daily/quest-modals/update-daily-quest-modal';
import UpdateMonthlyQuestModal from '@/components/views/quests/monthly/quest-modals/update-monthly-quest-modal';
import UpdateWeeklyQuestModal from '@/components/views/quests/weekly/quest-modals/update-weekly-quest-modal';
import { QuestTypesEnum, QuestTypesEnumType } from '@/contract/quests/base-quests';
import { IDailyQuest } from '@/contract/quests/quests-types/daily-quests';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { useDeleteDailyQuestMutation, useGetAllDailyQuestsQuery, usePatchDailyQuestMutation } from '@/redux/api/quests/daily-quests-api';
import { useDeleteMonthlyQuestMutation, useGetAllMonthlyQuestsQuery, usePatchMonthlyQuestMutation } from '@/redux/api/quests/monthly-quests-api';
import { useDeleteWeeklyQuestMutation, useGetAllWeeklyQuestsQuery, usePatchWeeklyQuestMutation } from '@/redux/api/quests/weekly-quests-api';

export type AllRecurringQuestsUnion = IMonthlyQuest | IDailyQuest | IWeeklyQuest;

export const useGetAllRecurringQuests = () => {
  const { data: monthlyQuests = [], isLoading: loadingMonthly, error: errorMonthly } = useGetAllMonthlyQuestsQuery();
  const { data: dailyQuests = [], isLoading: loadingDaily, error: errorDaily } = useGetAllDailyQuestsQuery();
  const { data: weeklyQuests = [], isLoading: loadingWeekly, error: errorWeekly } = useGetAllWeeklyQuestsQuery();

  const isLoading = loadingMonthly || loadingDaily || loadingWeekly;
  const error = errorMonthly || errorDaily || errorWeekly;

  const allQuests: AllRecurringQuestsUnion[] = [...monthlyQuests, ...dailyQuests, ...weeklyQuests];

  return { data: allQuests, isLoading, error };
};

const QuestRegistry = {
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
  return QuestRegistry[questType as keyof typeof QuestRegistry];
};
