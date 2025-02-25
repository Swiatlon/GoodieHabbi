import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const DashboardConfig = () => {
  return <CustomDrawerItem label="Dashboard" icon={<AntDesign name="dashboard" />} route="(authorized)/dashboard" />;
};

export default DashboardConfig;
