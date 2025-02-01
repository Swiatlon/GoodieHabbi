import React from 'react';
import { IOneTimeQuest } from '@/contract/one-time-quests';
import { IRepeatableQuest, ISeasonalQuest } from '@/contract/quest';
import { FilterValueType } from '@/hooks/use-filter';

export type QuestType = IOneTimeQuest | ISeasonalQuest | IRepeatableQuest;
export type QuestKeyType<T extends QuestType = QuestType> = keyof T;

export interface IFilterMapValues<T extends QuestType = QuestType> {
  filterMainKey: QuestKeyType<T>;
  value: FilterValueType;
  icon: React.ReactNode;
  color: string;
  label: string;
}
