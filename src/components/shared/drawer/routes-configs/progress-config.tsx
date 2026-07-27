import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const LeaderboardConfig = () => {
  const { t } = useTranslation();

  return <CustomDrawerItem label={t('nav.leaderboard')} icon={<Ionicons name="flag-outline" size={24} />} route="(authorized)/leaderboard" />;
};

export default LeaderboardConfig;
