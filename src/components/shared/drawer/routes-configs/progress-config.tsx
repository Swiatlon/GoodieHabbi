import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const LeaderboardConfig = () => (
  <CustomDrawerItem label="Leaderboard" icon={<Ionicons name="flag-outline" size={24} />} route="(authorized)/leaderboard" />
);

export default LeaderboardConfig;
