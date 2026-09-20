import { IQuest } from '../quests/quest.contract';

/**
 * A goal is a quest promoted for a window of time — `GET /goals/active/{goalType}` answers with the
 * ordinary `QuestDetailsDto`, so there is no separate goal shape to keep in sync any more. The old
 * `IUserGoal`, with its `season` / `weekdays` / `type` / `startDay` / `endDay`, belonged to the retired
 * typed quest model.
 *
 * The goal type picks the WINDOW, not a requirement on the quest: any quest can back a
 * Daily / Weekly / Monthly / Yearly goal, and `/quests/eligible-for-goal` has never filtered by type.
 * A goal is achieved by the first period that reaches its target inside that window.
 */
export type IGetActiveGoalResponse = IQuest;

export interface ICreateGoalRequest {
  goalType: string;
  questId: number;
}
