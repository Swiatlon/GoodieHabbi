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
      items={[
        {
          label: t('nav.workouts.activeSession'),
          icon: <Ionicons name="play-circle-outline" />,
          route: '(authorized)/workouts/sessions/active',
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
          label: t('nav.workouts.history'),
          icon: <Ionicons name="time-outline" />,
          route: '(authorized)/workouts/sessions',
        },
        {
          label: t('nav.workouts.analytics'),
          icon: <Ionicons name="stats-chart-outline" />,
          route: '(authorized)/workouts/analytics',
        },
      ]}
    />
  );
};

export default WorkoutsConfig;
