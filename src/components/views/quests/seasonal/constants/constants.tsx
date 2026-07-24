import { Ionicons } from '@expo/vector-icons';
import { IFilterMapValues } from '../../../../shared/config-modal/filter-modal';
import { BaseQuestFilterMap } from '../../reusable/constants/constants';
import { SeasonEnum } from '@/contract/quests/base-quests';
import { ISeasonalQuest } from '@/contract/quests/quests-types/seasonal-quests';

export const SeasonalQuestsFilterMap = {
  ...BaseQuestFilterMap,

  Season: new Map([
    [
      'WINTER',
      {
        filterMainKey: 'season',
        value: SeasonEnum.WINTER,
        icon: <Ionicons name="snow" size={28} color="#00bcd4" />,
        color: '#00bcd4',
        labelKey: 'quests.seasonal.seasons.winter',
      },
    ],
    [
      'SPRING',
      {
        filterMainKey: 'season',
        value: SeasonEnum.SPRING,
        icon: <Ionicons name="flower" size={28} color="#4caf50" />,
        color: '#4caf50',
        labelKey: 'quests.seasonal.seasons.spring',
      },
    ],
    [
      'SUMMER',
      {
        filterMainKey: 'season',
        value: SeasonEnum.SUMMER,
        icon: <Ionicons name="sunny" size={28} color="#ffeb3b" />,
        color: '#ffeb3b',
        labelKey: 'quests.seasonal.seasons.summer',
      },
    ],
    [
      'AUTUMN',
      {
        filterMainKey: 'season',
        value: SeasonEnum.AUTUMN,
        icon: <Ionicons name="leaf" size={28} color="#ff9800" />,
        color: '#ff9800',
        labelKey: 'quests.seasonal.seasons.autumn',
      },
    ],
  ]),
} as Record<string, Map<string, IFilterMapValues<ISeasonalQuest>>>;
