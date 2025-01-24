import { Ionicons } from '@expo/vector-icons';
import { IFilterMapValues } from '../../constants/quest-constants';
import { ISeasonalQuest } from '@/contract/quest';

export const SeasonalQuestsFilterMap = new Map<string, IFilterMapValues<ISeasonalQuest>>([
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
  [
    'WINTER',
    {
      key: 'season',
      value: 'winter',
      icon: <Ionicons name="snow" size={28} color="#00bcd4" />,
      color: '#00bcd4',
      label: 'Winter',
    },
  ],
  [
    'SPRING',
    {
      key: 'season',
      value: 'spring',
      icon: <Ionicons name="flower" size={28} color="#4caf50" />,
      color: '#4caf50',
      label: 'Spring',
    },
  ],
  [
    'SUMMER',
    {
      key: 'season',
      value: 'summer',
      icon: <Ionicons name="sunny" size={28} color="#ffeb3b" />,
      color: '#ffeb3b',
      label: 'Summer',
    },
  ],
  [
    'AUTUMN',
    {
      key: 'season',
      value: 'autumn',
      icon: <Ionicons name="leaf" size={28} color="#ff9800" />,
      color: '#ff9800',
      label: 'Autumn',
    },
  ],
]);

export const seasonDates = {
  winter: { startDate: '2025-12-21', endDate: '2025-03-19' },
  spring: { startDate: '2025-03-20', endDate: '2025-06-20' },
  summer: { startDate: '2025-06-21', endDate: '2025-09-22' },
  autumn: { startDate: '2025-09-23', endDate: '2025-12-20' },
};
