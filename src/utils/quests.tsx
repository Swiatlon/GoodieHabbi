import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
import { AllQuestsUnion } from '@/hooks/quests/useGetAllQuests';

export function isSeasonalQuest(quest: AllQuestsUnion): quest is ISeasonalQuest {
  return Boolean((quest as ISeasonalQuest).season);
}

export function isWeeklyQuest(quest: AllQuestsUnion): quest is IWeeklyQuest {
  return Boolean((quest as IWeeklyQuest).weekdays);
}

export function isMonthlyQuest(quest: AllQuestsUnion): quest is IMonthlyQuest {
  return Boolean((quest as IMonthlyQuest).startDay && (quest as IMonthlyQuest).endDay);
}
