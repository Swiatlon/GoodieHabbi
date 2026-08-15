import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const WorkoutsConfig = () => {
  const { t } = useTranslation();

  return (
    <CustomDrawerItem
      label={t('nav.workouts.root')}
      icon={<Ionicons name="barbell-outline" />}
      defaultOpen
      items={[
        {
          label: t('nav.workouts.activeSession'),
          icon: <Ionicons name="play-circle-outline" />,
          route: '(authorized)/workouts/sessions/active',
        },
        {
          label: t('nav.workouts.history'),
          icon: <Ionicons name="time-outline" />,
          route: '(authorized)/workouts/sessions',
        },
        {
          label: t('nav.workouts.exercises'),
          icon: <Ionicons name="list-outline" />,
          route: '(authorized)/workouts/exercises',
        },
        {
          label: t('nav.workouts.routines'),
          icon: <Ionicons name="repeat-outline" />,
          route: '(authorized)/workouts/routines',
        },
        {
          label: t('nav.workouts.analytics'),
          icon: <Ionicons name="stats-chart-outline" />,
          route: '(authorized)/workouts/analytics',
        },
        {
          label: t('nav.workouts.settings'),
          icon: <Ionicons name="settings-outline" />,
          route: '(authorized)/workouts/settings',
        },
        {
          label: t('nav.workouts.supplements.root'),
          icon: <Ionicons name="medkit-outline" />,
          children: [
            {
              label: t('nav.workouts.supplements.checklist'),
              icon: <Ionicons name="checkbox-outline" />,
              route: '(authorized)/supplements',
            },
            {
              label: t('nav.workouts.supplements.catalog'),
              icon: <Ionicons name="file-tray-full-outline" />,
              route: '(authorized)/supplements/catalog',
            },
            {
              label: t('nav.workouts.supplements.analytics'),
              icon: <Ionicons name="stats-chart-outline" />,
              route: '(authorized)/supplements/analytics',
            },
          ],
        },
      ]}
    />
  );
};

export default WorkoutsConfig;
