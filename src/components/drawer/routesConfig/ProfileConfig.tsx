import React from 'react';
import CustomDrawerItem from '../CustomDrawerItem';

const ProfileConfig = () => {
  return (
    <CustomDrawerItem
      label="Profile"
      icon="settings-outline"
      items={[
        { label: 'My Profile', route: 'profile/index', icon: 'person-outline' },
        {
          label: 'Settings',
          icon: 'wallet-outline',
          children: [{ label: 'other', route: 'profile/settings/other', icon: 'shield-checkmark-outline' }],
        },
        { label: 'shop', route: 'profile/shop', icon: 'notifications-outline' },
      ]}
    />
  );
};

export default ProfileConfig;
