import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const SupplementsConfig = () => {
  const { t } = useTranslation();

  return (
    <CustomDrawerItem
      label={t('nav.supplements.root')}
      icon={<Ionicons name="medkit-outline" />}
      items={[
        {
          label: t('nav.supplements.checklist'),
          icon: <Ionicons name="checkbox-outline" />,
          route: '(authorized)/supplements',
        },
        {
          label: t('nav.supplements.catalog'),
          icon: <Ionicons name="file-tray-full-outline" />,
          route: '(authorized)/supplements/catalog',
        },
        {
          label: t('nav.supplements.analytics'),
          icon: <Ionicons name="stats-chart-outline" />,
          route: '(authorized)/supplements/analytics',
        },
      ]}
    />
  );
};

export default SupplementsConfig;
