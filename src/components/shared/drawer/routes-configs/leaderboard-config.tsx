import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const GoalConfig = () => {
  return <CustomDrawerItem label="Leaderboard" icon={<Ionicons name="flag-outline" />} route="(authorized)/leaderboard" />;
};

export default GoalConfig;
