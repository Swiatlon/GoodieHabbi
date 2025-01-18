import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import '@/assets/styles/global.css';
import { CustomDrawerContent } from '@/components/shared/drawer/drawer';
import Header from '@/components/shared/app-bar/app-bar';
import SnackbarProvider from '@/providers/snackbar/snackbar-provider';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../src/assets/fonts/Rubik-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Appearance.setColorScheme('light');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <SnackbarProvider>
        <GestureHandlerRootView className="flex-1 bg-white">
          <Drawer
            screenOptions={{
              header: () => <Header />,
              sceneStyle: {
                backgroundColor: 'white',
              },
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
          >
            <Slot />
          </Drawer>
        </GestureHandlerRootView>
      </SnackbarProvider>
    </PaperProvider>
  );
}
