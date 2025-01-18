import { Ionicons } from '@expo/vector-icons';
import { IOneTimeQuest, ISeasonalQuest } from '@/contract/quest';
import { FilterValueType } from '@/hooks/use-filter';

export type QuestType = IOneTimeQuest | ISeasonalQuest;
export type QuestKeyType<T extends QuestType = QuestType> = keyof T;

interface IFilterMapValues<T extends QuestType = QuestType> {
  key: QuestKeyType<T>;
  value: FilterValueType;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const QuestFilterMap = new Map<string, IFilterMapValues>([
  ['ALL', { key: 'completed', value: null, icon: 'list', color: '#1987EE' }],
  ['COMPLETED', { key: 'completed', value: true, icon: 'checkmark-circle', color: '#4caf50' }],
  ['INCOMPLETED', { key: 'completed', value: false, icon: 'alert-circle', color: '#ffc107' }],
  ['IMPORTANT', { key: 'isImportant', value: true, icon: 'star', color: '#FF5722' }],
]);
