import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import ProfileConfig from '@/components/drawer/routesConfig/ProfileConfig';
import Header from '@/components/Header';
import '@/assets/styles/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../src/assets/fonts/Rubik-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: () => <Header />,
        }}
        drawerContent={props => (
          <DrawerContentScrollView {...props}>
            <ProfileConfig />
          </DrawerContentScrollView>
        )}
      >
        <Slot />
      </Drawer>
    </GestureHandlerRootView>
  );
}
