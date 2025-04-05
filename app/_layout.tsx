import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import '@/assets/styles/global.css';
import SpaceMonoFont from '../src/assets/fonts/Rubik-VariableFont_wght.ttf';
import Header from '@/components/shared/app-bar/app-bar';
import { CustomDrawerContent } from '@/components/shared/drawer/drawer';
import PersistLoginMiddleware from '@/middlewares/persist-login-middleware';
import PrefetchMiddleware from '@/middlewares/prefetch-middleware';
import RoutesPermissionMiddleware from '@/middlewares/routes-permission-middleware';
import SnackbarProvider from '@/providers/snackbar/snackbar-provider';
import { store } from '@/redux/config/store';
import '@/configs/day-js-config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loadingState, setLoadingState] = useState({
    fonts: true,
    persistLogin: true,
    prefetch: false,
  });

  const [fontsLoaded] = useFonts({
    SpaceMono: SpaceMonoFont,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setLoadingState(prevState => ({ ...prevState, fonts: false }));
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const { fonts, persistLogin, prefetch } = loadingState;

    if (!(fonts || persistLogin || prefetch)) {
      SplashScreen.hideAsync();
    }
  }, [loadingState]);

  const handleLoaded = (key: string) => {
    setLoadingState(prevState => ({ ...prevState, [key]: false }));
  };

  return (
    <Host>
      <SnackbarProvider>
        <Provider store={store}>
          <GestureHandlerRootView className="flex-1 bg-white">
            <PersistLoginMiddleware onLoaded={() => handleLoaded('persistLogin')}>
              <RoutesPermissionMiddleware>
                <PrefetchMiddleware onLoaded={() => handleLoaded('prefetch')}>
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
                </PrefetchMiddleware>
              </RoutesPermissionMiddleware>
            </PersistLoginMiddleware>
          </GestureHandlerRootView>
        </Provider>
      </SnackbarProvider>
    </Host>
  );
}
