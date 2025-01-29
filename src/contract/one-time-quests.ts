import { PriorityEnumType } from './quest';

export interface IOneTimeQuest {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: PriorityEnumType | null;
  isCompleted: boolean;
  emoji: string | null;
}

export interface IGetOneTimeQuestByIdParams {
  id: number;
}

export interface IPostOneTimeQuestRequest {
  title: string;
  description: string | null;
  emoji: string | null;
  priority: PriorityEnumType | null;
  startDate: string | null;
  endDate: string | null;
}

export interface IPutOneTimeQuestRequest {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: PriorityEnumType | null;
  isCompleted: boolean | null;
}

export interface IPatchQuestRequest {
  id: number;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: PriorityEnumType | null;
  isCompleted?: boolean | null;
  emoji?: string | null;
}
