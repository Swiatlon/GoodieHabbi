import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const DashboardConfig = () => {
  const { t } = useTranslation();

  return <CustomDrawerItem label={t('nav.dashboard')} icon={<Ionicons name="grid-outline" size={24} />} route="(authorized)/dashboard" />;
};

export default DashboardConfig;
