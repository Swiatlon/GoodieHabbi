import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const FinanceConfig = () => {
  const { t } = useTranslation();

  return <CustomDrawerItem label={t('nav.finance.root')} icon={<Ionicons name="wallet-outline" />} route="(authorized)/finance" />;
};

export default FinanceConfig;
