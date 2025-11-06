import React from 'react';
import { View } from 'react-native';
import { MenuButton, LogoButton, SettingsDropdown } from '@/components/views/app-bar';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

export const AppBar = () => {
  const { isCorrect: isAuthenticated } = useIsCorrectAccessToken();

  return (
    <View className="flex-row justify-between items-center bg-primary px-4 py-2 w-full">
      <MenuButton />
      <LogoButton />
      {isAuthenticated && <SettingsDropdown />}
    </View>
  );
};

export default AppBar;
