import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const GoalConfig = () => {
  return (
    <CustomDrawerItem
      label="Goals"
      icon={<Ionicons name="flag-outline" />}
      items={[
        {
          label: 'Daily Goals',
          route: '(authorized)/goals/daily',
          icon: <Ionicons name="sunny-outline" />,
        },
        {
          label: 'Weekly Goals',
          route: '(authorized)/goals/weekly',
          icon: <Ionicons name="calendar-outline" />,
        },
        {
          label: 'Monthly Goals',
          route: '(authorized)/goals/monthly',
          icon: <Ionicons name="calendar-number-outline" />,
        },
        {
          label: 'Yearly Goals',
          route: '(authorized)/goals/yearly',
          icon: <Ionicons name="trophy-outline" />,
        },
      ]}
    />
  );
};

export default GoalConfig;
