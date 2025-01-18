import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';


const LoginConfig = () => {
  return <CustomDrawerItem label="Login" icon={<AntDesign name="login" />} route="login" />;
};

export default LoginConfig;
