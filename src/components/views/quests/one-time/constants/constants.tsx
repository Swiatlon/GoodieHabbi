import { Ionicons } from '@expo/vector-icons';
import { IFilterMapValues } from '../../constants/quest-constants';

export const OneTimeQuestsFilterMap = new Map<string, IFilterMapValues>([
  [
    'ALL',
    {
      key: 'completed',
      value: null,
      icon: <Ionicons name="list" size={28} color="#1987EE" />,
      color: '#1987EE',
      label: 'All',
    },
  ],
  [
    'COMPLETED',
    {
      key: 'completed',
      value: true,
      icon: <Ionicons name="checkmark-circle" size={28} color="#4caf50" />,
      color: '#4caf50',
      label: 'Completed',
    },
  ],
  [
    'INCOMPLETED',
    {
      key: 'completed',
      value: false,
      icon: <Ionicons name="alert-circle" size={28} color="#ffc107" />,
      color: '#ffc107',
      label: 'Incomplete',
    },
  ],
  [
    'LOW_PRIORITY',
    {
      key: 'priority',
      value: 'low',
      icon: <Ionicons name="arrow-down-circle" size={28} color="#4caf50" />,
      color: '#4caf50',
      label: 'Low priority',
    },
  ],
  [
    'MEDIUM_PRIORITY',
    {
      key: 'priority',
      value: 'medium',
      icon: <Ionicons name="arrow-forward-circle" size={28} color="#ff9800" />,
      color: '#ff9800',
      label: 'Medium priority',
    },
  ],
  [
    'HIGH_PRIORITY',
    {
      key: 'priority',
      value: 'high',
      icon: <Ionicons name="arrow-up-circle" size={28} color="#f44336" />,
      color: '#f44336',
      label: 'High priority',
    },
  ],
]);
