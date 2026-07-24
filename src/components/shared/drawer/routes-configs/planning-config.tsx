import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const PlanningConfig = () => {
  const { t } = useTranslation();

  return (
    <CustomDrawerItem
      label={t('nav.planning.root')}
      icon={<Ionicons name="calendar-outline" />}
      items={[
        {
          label: t('nav.planning.tags'),
          route: '(authorized)/quests/tags',
          icon: <Ionicons name="pricetag-outline" />,
        },
        {
          label: t('nav.planning.goals.root'),
          icon: <Ionicons name="flag-outline" />,
          children: [
            {
              label: t('nav.planning.goals.daily'),
              route: '(authorized)/goals/daily',
              icon: <Ionicons name="sunny-outline" />,
            },
            {
              label: t('nav.planning.goals.weekly'),
              route: '(authorized)/goals/weekly',
              icon: <Ionicons name="calendar-outline" />,
            },
            {
              label: t('nav.planning.goals.monthly'),
              route: '(authorized)/goals/monthly',
              icon: <Ionicons name="calendar-number-outline" />,
            },
            {
              label: t('nav.planning.goals.yearly'),
              route: '(authorized)/goals/yearly',
              icon: <Ionicons name="trophy-outline" />,
            },
          ],
        },
      ]}
    />
  );
};

export default PlanningConfig;
