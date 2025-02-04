import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const QuestConfig = () => {
  return (
    <CustomDrawerItem
      label="Quests"
      icon={<Ionicons name="trophy-outline" />}
      items={[
        {
          label: 'All Quests',
          icon: <Ionicons name="trophy-outline" />,
          route: 'quests/all',
        },
        {
          label: 'Today Quests',
          route: 'quests/today',
          icon: <Ionicons name="today-outline" />,
        },
        {
          label: 'Seasonal Quests',
          route: 'quests/seasonal',
          icon: <Ionicons name="calendar-outline" />,
        },
        {
          label: 'Recurring Quests',
          icon: <Ionicons name="repeat-outline" />,
          children: [
            {
              label: 'Daily Quests',
              route: 'quests/recurring/daily',
              icon: <Ionicons name="sunny-outline" />,
            },
            {
              label: 'Weekly Quests',
              route: 'quests/recurring/weekly',
              icon: <Ionicons name="calendar-outline" />,
            },
            {
              label: 'Monthly Quests',
              route: 'quests/recurring/monthly',
              icon: <Ionicons name="calendar-number-outline" />,
            },
          ],
        },
        {
          label: 'One-Time Quests',
          route: 'quests/one-time',
          icon: <Ionicons name="checkmark-done-outline" />,
        },
      ]}
    />
  );
};

export default QuestConfig;
