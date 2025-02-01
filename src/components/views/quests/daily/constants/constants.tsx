import { Ionicons } from '@expo/vector-icons';
import { IFilterMapValues } from '../../constants/quest-constants';
import { PriorityEnum } from '@/contract/quest';

export const DailyQuestFilterMap: Record<string, Map<string, IFilterMapValues>> = {
  Status: new Map([
    [
      'ALL',
      {
        filterMainKey: 'isCompleted',
        value: null,
        icon: <Ionicons name="list" size={28} color="#1987EE" />,
        label: 'All',
        color: '#1987EE',
      },
    ],
    [
      'COMPLETED',
      {
        filterMainKey: 'isCompleted',
        value: true,
        icon: <Ionicons name="checkmark-circle" size={28} color="#4caf50" />,
        label: 'Completed',
        color: '#4caf50',
      },
    ],
    [
      'INCOMPLETED',
      {
        filterMainKey: 'isCompleted',
        value: false,
        icon: <Ionicons name="alert-circle" size={28} color="#ffc107" />,
        label: 'Incomplete',
        color: '#ffc107',
      },
    ],
  ]),

  Priority: new Map([
    [
      'LOW_PRIORITY',
      {
        filterMainKey: 'priority',
        value: PriorityEnum.LOW,
        icon: <Ionicons name="arrow-down-circle" size={28} color="#4caf50" />,
        label: 'Low priority',
        color: '#4caf50',
      },
    ],
    [
      'MEDIUM_PRIORITY',
      {
        filterMainKey: 'priority',
        value: PriorityEnum.MEDIUM,
        icon: <Ionicons name="arrow-forward-circle" size={28} color="#ff9800" />,
        label: 'Medium priority',
        color: '#ff9800',
      },
    ],
    [
      'HIGH_PRIORITY',
      {
        filterMainKey: 'priority',
        value: PriorityEnum.HIGH,
        icon: <Ionicons name="arrow-up-circle" size={28} color="#f44336" />,
        label: 'High priority',
        color: '#f44336',
      },
    ],
  ]),
};
