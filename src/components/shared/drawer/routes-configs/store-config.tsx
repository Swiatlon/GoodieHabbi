import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const ShopConfig = () => {
  const { t } = useTranslation();

  return <CustomDrawerItem label={t('nav.shop')} icon={<Ionicons name="cart-outline" size={24} />} route="(authorized)/shop" />;
};

export default ShopConfig;
