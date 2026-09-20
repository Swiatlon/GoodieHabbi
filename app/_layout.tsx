import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import '@/assets/styles/global.css';
import SpaceMonoFont from '../src/assets/fonts/Rubik-VariableFont_wght.ttf';
import { AchievementOverlay } from '@/components/shared/achievements-overlay/achievements-overlay';
import Header from '@/components/shared/app-bar/app-bar';
import { CustomDrawerContent } from '@/components/shared/drawer/drawer';
import PersistLoginMiddleware from '@/middlewares/persist-login-middleware';
import PrefetchMiddleware from '@/middlewares/prefetch-middleware';
import RoutesPermissionMiddleware from '@/middlewares/routes-permission-middleware';
import { ApiErrorListener } from '@/providers/api-error/api-error-listener';
import { FeatureGroupsProvider } from '@/providers/feature-groups-context';
import { FinanceDisplayProvider } from '@/providers/finance-display-context';
import { NotificationsProvider } from '@/providers/notification-provider/notification-provider';
import SnackbarProvider from '@/providers/snackbar/snackbar-provider';
import { store } from '@/redux/config/store';
import '@/configs/day-js-config';
import '@/i18n/i18n';
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
    <SafeAreaProvider>
      {/*
        `Host` must sit INSIDE `Provider`. Every `Modal` renders its children through a `Portal`, which
        mounts them under the host rather than where they are written — so with the host above the store,
        any Redux hook inside a modal threw "could not find react-redux context value". It went unnoticed
        while modals only ever called those hooks in the component that rendered `<Modal>`, never in its
        children. `SnackbarProvider` moves below the host because its own snackbar is a portal too.
      */}
      <Provider store={store}>
        <Host>
          <SnackbarProvider>
            <ApiErrorListener />
            <GestureHandlerRootView className="flex-1 bg-white">
              <PersistLoginMiddleware onLoaded={() => handleLoaded('persistLogin')}>
                <RoutesPermissionMiddleware>
                  <PrefetchMiddleware onLoaded={() => handleLoaded('prefetch')}>
                    <NotificationsProvider>
                      <FinanceDisplayProvider>
                        <FeatureGroupsProvider>
                          <AchievementOverlay />
                          <Drawer
                            screenOptions={{
                              header: () => <Header />,
                              sceneStyle: {
                                backgroundColor: 'white',
                              },
                            }}
                            drawerContent={props => <CustomDrawerContent {...props} />}
                          />
                        </FeatureGroupsProvider>
                      </FinanceDisplayProvider>
                    </NotificationsProvider>
                  </PrefetchMiddleware>
                </RoutesPermissionMiddleware>
              </PersistLoginMiddleware>
            </GestureHandlerRootView>
          </SnackbarProvider>
        </Host>
      </Provider>
    </SafeAreaProvider>
  );
}
