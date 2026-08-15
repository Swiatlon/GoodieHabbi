import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import Button from '../button/button';
import DrawerSection from './elements/drawer-section';
import AccountConfig from './routes-configs/account-config';
import DashboardConfig from './routes-configs/dashboard-config';
import FinanceConfig from './routes-configs/finance-config';
import PlanningConfig from './routes-configs/planning-config';
import ProgressConfig from './routes-configs/progress-config';
import StoreConfig from './routes-configs/store-config';
import LoginConfig from '@/components/shared/drawer/routes-configs/login-config';
import QuestConfig from '@/components/shared/drawer/routes-configs/quest-config';
import RegisterConfig from '@/components/shared/drawer/routes-configs/register-config';
import WorkoutsConfig from '@/components/shared/drawer/routes-configs/workouts-config';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useTypedDispatch } from '@/hooks/use-store-hooks';
import { useFeatureGroups } from '@/providers/feature-groups-context';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { logOutAsync } from '@/redux/state/auth/auth-state';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const drawerStatus = useDrawerStatus();
  const { isCorrect: isAuthenticated } = useIsCorrectAccessToken();
  const { isGroupEnabled } = useFeatureGroups();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const isDrawerOpen = drawerStatus === 'open';
  const logoutStyle = useTransformFade({ delay: 500, direction: 'right', isContentLoading: !isDrawerOpen, preventOpacity: true });

  const handleLogout = () => {
    dispatch(logOutAsync());
    router.navigate('/(not-authorized)/login');
    showSnackbar({ text: t('common.loggedOutSuccess'), variant: SnackbarVariantEnum.SUCCESS });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-2 py-4 flex flex-grow">
        <View className="flex items-end">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="p-[0.1] ml-auto">
            <Ionicons name="close" size={22} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex gap-6 flex-grow">
          {!isAuthenticated ? (
            <>
              <RegisterConfig />
              <LoginConfig />
            </>
          ) : (
            <>
              <DashboardConfig />

              {isGroupEnabled('finance') && (
                <DrawerSection title={t('nav.sections.finance')}>
                  <FinanceConfig />
                </DrawerSection>
              )}

              {isGroupEnabled('tasks') && (
                <DrawerSection title={t('nav.sections.tasks')}>
                  <QuestConfig />
                  <ProgressConfig />
                  <StoreConfig />
                  <PlanningConfig />
                </DrawerSection>
              )}

              {isGroupEnabled('workouts') && (
                <DrawerSection title={t('nav.sections.workouts')}>
                  <WorkoutsConfig />
                </DrawerSection>
              )}

              <AccountConfig />
            </>
          )}
        </View>

        {isAuthenticated && (
          <Animated.View style={logoutStyle}>
            <Button
              startIcon={<Ionicons name="log-out-outline" size={20} color="white" />}
              onPress={handleLogout}
              label={t('common.logout')}
              className="px-6 mr-auto text-center mt-4"
            />
          </Animated.View>
        )}
      </View>
    </DrawerContentScrollView>
  );
};
