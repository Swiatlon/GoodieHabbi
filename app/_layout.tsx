import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import '@/assets/styles/global.css';
import Header from '@/components/shared/app-bar/app-bar';
import { CustomDrawerContent } from '@/components/shared/drawer/drawer';
import PersistLoginMiddleware from '@/middlewares/persist-login-middleware';
import SnackbarProvider from '@/providers/snackbar/snackbar-provider';
import { store } from '@/redux/config/store';
import '@/configs/day-js-config';

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
    <SnackbarProvider>
      <Provider store={store}>
        <GestureHandlerRootView className="flex-1 bg-white">
          <PersistLoginMiddleware>
            {/* <RoutesPermissionMiddleware> */}
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
            {/* </RoutesPermissionMiddleware> */}
          </PersistLoginMiddleware>
        </GestureHandlerRootView>
      </Provider>
    </SnackbarProvider>
  );
}
