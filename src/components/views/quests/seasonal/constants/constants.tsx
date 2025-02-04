import { Ionicons } from '@expo/vector-icons';
import { IFilterMapValues } from '../../reusable/config-modal/config-modal';
import { PriorityEnum, SeasonEnum } from '@/contract/quests/base-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';

export const SeasonalQuestsFilterMap: Record<string, Map<string, IFilterMapValues<ISeasonalQuest>>> = {
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

  Season: new Map([
    [
      'WINTER',
      {
        filterMainKey: 'season',
        value: SeasonEnum.WINTER,
        icon: <Ionicons name="snow" size={28} color="#00bcd4" />,
        color: '#00bcd4',
        label: 'Winter',
      },
    ],
    [
      'SPRING',
      {
        filterMainKey: 'season',
        value: SeasonEnum.SPRING,
        icon: <Ionicons name="flower" size={28} color="#4caf50" />,
        color: '#4caf50',
        label: 'Spring',
      },
    ],
    [
      'SUMMER',
      {
        filterMainKey: 'season',
        value: SeasonEnum.SUMMER,
        icon: <Ionicons name="sunny" size={28} color="#ffeb3b" />,
        color: '#ffeb3b',
        label: 'Summer',
      },
    ],
    [
      'AUTUMN',
      {
        filterMainKey: 'season',
        value: SeasonEnum.AUTUMN,
        icon: <Ionicons name="leaf" size={28} color="#ff9800" />,
        color: '#ff9800',
        label: 'Autumn',
      },
    ],
  ]),
};
export const seasonDates: Record<string, { startDate: string; endDate: string }> = {
  winter: { startDate: '2025-12-21', endDate: '2026-03-19' },
  spring: { startDate: '2026-03-20', endDate: '2026-06-20' },
  summer: { startDate: '2026-06-21', endDate: '2026-09-22' },
  autumn: { startDate: '2026-09-23', endDate: '2026-12-20' },
};
