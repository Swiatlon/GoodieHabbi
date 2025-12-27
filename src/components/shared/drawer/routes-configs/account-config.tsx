import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const AccountConfig = () => (
  <CustomDrawerItem
    label="Account"
    icon={<Ionicons name="person-circle-outline" />}
    items={[
      {
        label: 'Profile',
        icon: <Ionicons name="person-outline" />,
        route: '(authorized)/profile',
      },
      {
        label: 'Notifications',
        icon: <Ionicons name="notifications-outline" />,
        route: '(authorized)/notifications',
      },
      {
        label: 'Inventory',
        icon: <Ionicons name="cube-outline" />,
        route: '(authorized)/inventory',
      },
    ]}
  />
);

export default AccountConfig;
