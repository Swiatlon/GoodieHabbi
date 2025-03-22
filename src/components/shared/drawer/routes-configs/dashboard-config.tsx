import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const DashboardConfig = () => {
  return <CustomDrawerItem label="Dashboard" icon={<Ionicons name="grid-outline" size={24} />} route="(authorized)/dashboard" />;
};

export default DashboardConfig;
