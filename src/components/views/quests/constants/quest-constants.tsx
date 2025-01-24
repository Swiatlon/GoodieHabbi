import React from 'react';
import { IOneTimeQuest, ISeasonalQuest } from '@/contract/quest';
import { FilterValueType } from '@/hooks/use-filter';

export type QuestType = IOneTimeQuest | ISeasonalQuest;
export type QuestKeyType<T extends QuestType = QuestType> = keyof T;

export interface IFilterMapValues<T extends QuestType = QuestType> {
  key: QuestKeyType<T>;
  value: FilterValueType;
  icon: React.ReactNode;
  color: string;
  label: string;
}
