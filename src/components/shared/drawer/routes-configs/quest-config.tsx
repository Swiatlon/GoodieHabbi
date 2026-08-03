import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const QuestConfig = () => {
  const { t } = useTranslation();

  return (
    <CustomDrawerItem
      label={t('nav.quests.root')}
      icon={<Ionicons name="trophy-outline" />}
      defaultOpen
      items={[
        {
          label: t('nav.quests.all'),
          icon: <Ionicons name="trophy-outline" />,
          route: '(authorized)/quests/all',
        },
        {
          label: t('nav.quests.today'),
          route: '(authorized)/quests/today',
          icon: <Ionicons name="today-outline" />,
        },
        {
          label: t('nav.quests.seasonal'),
          route: '(authorized)/quests/seasonal',
          icon: <Ionicons name="calendar-outline" />,
        },
        {
          label: t('nav.quests.recurring.root'),
          icon: <Ionicons name="repeat-outline" />,
          children: [
            {
              label: t('nav.quests.recurring.all'),
              icon: <Ionicons name="trophy-outline" />,
              route: '(authorized)/quests/recurring/all',
            },
            {
              label: t('nav.quests.recurring.daily'),
              route: '(authorized)/quests/recurring/daily',
              icon: <Ionicons name="sunny-outline" />,
            },
            {
              label: t('nav.quests.recurring.weekly'),
              route: '(authorized)/quests/recurring/weekly',
              icon: <Ionicons name="calendar-outline" />,
            },
            {
              label: t('nav.quests.recurring.monthly'),
              route: '(authorized)/quests/recurring/monthly',
              icon: <Ionicons name="calendar-number-outline" />,
            },
          ],
        },
        {
          label: t('nav.quests.oneTime'),
          route: '(authorized)/quests/one-time',
          icon: <Ionicons name="checkmark-done-outline" />,
        },
        {
          label: t('nav.quests.analytics'),
          route: '(authorized)/quests/analytics',
          icon: <Ionicons name="stats-chart-outline" />,
        },
      ]}
    />
  );
};

export default QuestConfig;
