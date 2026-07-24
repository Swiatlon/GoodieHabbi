import React from 'react';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const RegisterConfig = () => {
  const { t } = useTranslation();

  return <CustomDrawerItem label={t('nav.register')} icon={<AntDesign name="adduser" />} route="(not-authorized)/register" />;
};

export default RegisterConfig;
