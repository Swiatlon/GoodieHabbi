import { PriorityEnum } from './quest';

// GET
export interface IGetOneTimeQuestsResponse {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  priorityLevel: PriorityEnum | null;
  isCompleted: boolean | null;
  emoji: string | null;
}

export interface IGetAllQuestsQueryParams {}

// POST
export interface ICreateQuestRequest {
  title: string;
  description: string | null;
  selectedEmoji: string | null;
  priorityLevel: PriorityEnum | null;
  startDate: Date | null;
  endDate: Date | null;
  isCompleted: boolean;
  emoji: string | null;
}

export interface ICreateQuestResponse {}

// PUT
export interface IUpdateQuestRequest {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priorityLevel?: string;
  isCompleted?: boolean;
}

export interface IUpdateQuestResponse {}

// DELETE
export interface IDeleteQuestRequest {
  id: number;
}

export interface IDeleteQuestResponse {}
