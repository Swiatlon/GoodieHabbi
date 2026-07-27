import React from 'react';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const LoginConfig = () => {
  const { t } = useTranslation();

  return <CustomDrawerItem label={t('nav.login')} icon={<AntDesign name="login" />} route="(not-authorized)/login" />;
};

export default LoginConfig;
