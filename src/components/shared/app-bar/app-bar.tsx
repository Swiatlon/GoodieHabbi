import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton, LogoButton, SettingsDropdown } from '@/components/views/app-bar';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

export const AppBar = () => {
  const { isCorrect: isAuthenticated } = useIsCorrectAccessToken();

  return (
    <SafeAreaView edges={['top']} className="bg-primary">
      <View className="flex-row justify-between items-center px-4 py-2 w-full">
        <MenuButton />
        <LogoButton />
        <View>{isAuthenticated && <SettingsDropdown />}</View>
      </View>
    </SafeAreaView>
  );
};

export default AppBar;
