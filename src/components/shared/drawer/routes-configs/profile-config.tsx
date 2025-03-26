import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';

const ProfileConfig = () => {
  return <CustomDrawerItem label="Profile" icon={<AntDesign name="user" />} route="(authorized)/profile" />;
};

export default ProfileConfig;
