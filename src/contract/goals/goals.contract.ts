import { PriorityEnumType, QuestTypesEnumType, SeasonEnumType, WeekdayEnumType } from '../quests/base-quests';
import { IQuestLabel } from '../quests/labels/labels-quests';

export interface IUserGoal {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  emoji: string;
  isCompleted: boolean;
  season?: SeasonEnumType;
  weekdays?: WeekdayEnumType[];
  priority: PriorityEnumType;
  type: QuestTypesEnumType;
  labels: IQuestLabel[];
}

export interface ICreateGoalRequest {
  goalType: string;
  questType: string;
}

export interface IGetActiveGoalResponse extends IUserGoal {}

export interface IUpdateActiveGoalRequest {
  goalType: string;
}
