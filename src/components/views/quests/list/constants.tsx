import { IFilterMapValues } from '../../../shared/config-modal/filter-modal';
import { BaseQuestFilterMap } from '../reusable/constants/constants';
import { IQuest, PeriodUnitEnum } from '@/contract/quests/quest.contract';

/** Status and priority filter the same way for every quest now that there are no per-type screens. */
export const QuestFilterMap = {
  ...BaseQuestFilterMap,
} as Record<string, Map<string, IFilterMapValues<IQuest>>>;

/**
 * The chips that replaced the per-type screens. They are a view over one `GET /quests`, not five
 * requests, so a user can combine "weekly" with the search box and the sort order — combinations the
 * old drawer tree could not express at all.
 */
export const QuestScopeEnum = {
  REPEATING: 'Repeating',
  ONE_OFF: 'OneOff',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
  AT_RISK: 'AtRisk',
} as const;

export type QuestScopeEnumType = (typeof QuestScopeEnum)[keyof typeof QuestScopeEnum];

export const QUEST_SCOPE_FILTERS: { key: QuestScopeEnumType; labelKey: string; emoji: string; matches: (quest: IQuest) => boolean }[] = [
  {
    key: QuestScopeEnum.REPEATING,
    labelKey: 'quests.all.scopes.repeating',
    emoji: '🔁',
    matches: quest => quest.schedule.unit !== PeriodUnitEnum.NONE,
  },
  {
    key: QuestScopeEnum.ONE_OFF,
    labelKey: 'quests.all.scopes.oneOff',
    emoji: '☑️',
    matches: quest => quest.schedule.unit === PeriodUnitEnum.NONE,
  },
  { key: QuestScopeEnum.DAILY, labelKey: 'quests.all.scopes.daily', emoji: '☀️', matches: quest => quest.schedule.unit === PeriodUnitEnum.DAY },
  { key: QuestScopeEnum.WEEKLY, labelKey: 'quests.all.scopes.weekly', emoji: '📅', matches: quest => quest.schedule.unit === PeriodUnitEnum.WEEK },
  { key: QuestScopeEnum.MONTHLY, labelKey: 'quests.all.scopes.monthly', emoji: '🗓️', matches: quest => quest.schedule.unit === PeriodUnitEnum.MONTH },
  { key: QuestScopeEnum.YEARLY, labelKey: 'quests.all.scopes.yearly', emoji: '🌦️', matches: quest => quest.schedule.unit === PeriodUnitEnum.YEAR },
  {
    /**
     * `isAtRisk` is always false on a Day schedule by design, so this chip only ever surfaces weekly and
     * monthly habits — which is the point: "not done yet" means nothing on a daily one.
     */
    key: QuestScopeEnum.AT_RISK,
    labelKey: 'quests.all.scopes.atRisk',
    emoji: '⚠️',
    matches: quest => quest.currentPeriod?.isAtRisk === true,
  },
];
