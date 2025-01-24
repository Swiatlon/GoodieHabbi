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
  label: string;
}

export const QuestFilterMap = new Map<string, IFilterMapValues>([
  ['ALL', { key: 'completed', value: null, icon: 'list', color: '#1987EE', label: 'All' }],
  ['COMPLETED', { key: 'completed', value: true, icon: 'checkmark-circle', color: '#4caf50', label: 'Completed' }],
  ['INCOMPLETED', { key: 'completed', value: false, icon: 'alert-circle', color: '#ffc107', label: 'Incomplete' }],
  [
    'LOW_PRIORITY',
    { key: 'priority', value: 'low', icon: 'arrow-down-circle', color: '#4caf50', label: 'Low priority' },
  ],
  [
    'MEDIUM_PRIORITY',
    { key: 'priority', value: 'medium', icon: 'arrow-forward-circle', color: '#ff9800', label: 'Medium priority' },
  ],
  [
    'HIGH_PRIORITY',
    { key: 'priority', value: 'high', icon: 'arrow-up-circle', color: '#f44336', label: 'High priority' },
  ],
]);
