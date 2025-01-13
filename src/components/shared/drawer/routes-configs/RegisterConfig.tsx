import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/CustomDrawerItem';


const RegisterConfig = () => {
  return <CustomDrawerItem label="Register" icon={<AntDesign name="adduser" />} route="register" />;
};

export default RegisterConfig;
