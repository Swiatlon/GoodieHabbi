import { isSeasonalQuest, isWeeklyQuest, isMonthlyQuest } from './quests';
import { PriorityEnum, QuestTypesEnum, SeasonEnum } from '@/contract/quests/base-quests';
import { IMonthlyQuest } from '@/contract/quests/quests-types/monthly-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';
import { IWeeklyQuest } from '@/contract/quests/quests-types/weekly-quests';
describe('Quest Type Guards', () => {
  const QUEST_DESCRIPTION = 'Complete summer-themed challenges.';
  const QUEST_TITLE = 'Summer Adventure';
  const QUEST_START_DATE = '2024-06-01';
  const QUEST_END_DATE = '2024-08-31';

  const seasonalQuest: ISeasonalQuest = {
    id: 1,
    season: SeasonEnum.SUMMER,
    title: QUEST_TITLE,
    description: QUEST_DESCRIPTION,
    startDate: QUEST_START_DATE,
    endDate: QUEST_END_DATE,
    isCompleted: false,
    priority: PriorityEnum.MEDIUM,
    emoji: '🌞',
    type: QuestTypesEnum.SEASONAL,
    labels: [],
  };

  const weeklyQuest: IWeeklyQuest = {
    id: 1,
    title: QUEST_TITLE,
    description: QUEST_DESCRIPTION,
    startDate: QUEST_START_DATE,
    endDate: QUEST_END_DATE,
    isCompleted: false,
    priority: PriorityEnum.MEDIUM,
    emoji: '🌞',
    type: QuestTypesEnum.SEASONAL,
    labels: [],
    weekdays: [],
  };

  const monthlyQuest: IMonthlyQuest = {
    id: 1,
    title: QUEST_TITLE,
    description: QUEST_DESCRIPTION,
    startDate: QUEST_START_DATE,
    endDate: QUEST_END_DATE,
    isCompleted: false,
    priority: PriorityEnum.MEDIUM,
    emoji: '🌞',
    type: QuestTypesEnum.MONTHLY,
    labels: [],
    startDay: 0,
    endDay: 0,
  };

  it('identifies seasonal quests', () => {
    expect(isSeasonalQuest(seasonalQuest)).toBe(true);
    expect(isSeasonalQuest(weeklyQuest)).toBe(false);
    expect(isSeasonalQuest(monthlyQuest)).toBe(false);
  });

  it('identifies weekly quests', () => {
    expect(isWeeklyQuest(weeklyQuest)).toBe(true);
    expect(isWeeklyQuest(seasonalQuest)).toBe(false);
    expect(isWeeklyQuest(monthlyQuest)).toBe(false);
  });

  it('identifies monthly quests', () => {
    expect(isMonthlyQuest(monthlyQuest)).toBe(true);
    expect(isMonthlyQuest(weeklyQuest)).toBe(false);
    expect(isMonthlyQuest(seasonalQuest)).toBe(false);
  });
});
