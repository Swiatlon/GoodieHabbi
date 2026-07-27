import { Ionicons } from '@expo/vector-icons';
import { PriorityEnum } from '@/contract/quests/base-quests';

export const BaseQuestFilterMap = {
  Status: new Map([
    [
      'ALL',
      {
        filterMainKey: 'isCompleted',
        value: null,
        icon: <Ionicons name="list" size={28} color="#1987EE" />,
        labelKey: 'status.all',
        color: '#1987EE',
      },
    ],
    [
      'COMPLETED',
      {
        filterMainKey: 'isCompleted',
        value: true,
        icon: <Ionicons name="checkmark-circle" size={28} color="#4caf50" />,
        labelKey: 'status.completed',
        color: '#4caf50',
      },
    ],
    [
      'INCOMPLETED',
      {
        filterMainKey: 'isCompleted',
        value: false,
        icon: <Ionicons name="alert-circle" size={28} color="#ffc107" />,
        labelKey: 'status.incomplete',
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
        labelKey: 'priority.low',
        color: '#4caf50',
      },
    ],
    [
      'MEDIUM_PRIORITY',
      {
        filterMainKey: 'priority',
        value: PriorityEnum.MEDIUM,
        icon: <Ionicons name="arrow-forward-circle" size={28} color="#ff9800" />,
        labelKey: 'priority.medium',
        color: '#ff9800',
      },
    ],
    [
      'HIGH_PRIORITY',
      {
        filterMainKey: 'priority',
        value: PriorityEnum.HIGH,
        icon: <Ionicons name="arrow-up-circle" size={28} color="#f44336" />,
        labelKey: 'priority.high',
        color: '#f44336',
      },
    ],
  ]),
};
