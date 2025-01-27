import React from 'react';
import { IGetOneTimeQuestsResponse } from '@/contract/one-time-quests';
import { ISeasonalQuest } from '@/contract/quest';
import { FilterValueType } from '@/hooks/use-filter';

export type QuestType = IGetOneTimeQuestsResponse | ISeasonalQuest;
export type QuestKeyType<T extends QuestType = QuestType> = keyof T;

export interface IFilterMapValues<T extends QuestType = QuestType> {
  key: QuestKeyType<T>;
  value: FilterValueType;
  icon: React.ReactNode;
  color: string;
  label: string;
}
