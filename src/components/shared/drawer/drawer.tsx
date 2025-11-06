import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import Button from '../button/button';
import DashboardConfig from './routes-configs/dashboard-config';
import GoalConfig from './routes-configs/goal-config';
import LeaderboardConfig from './routes-configs/leaderboard-config';
import ProfileConfig from './routes-configs/profile-config';
import LoginConfig from '@/components/shared/drawer/routes-configs/login-config';
import NotificationsConfig from '@/components/shared/drawer/routes-configs/notifications-config';
import QuestConfig from '@/components/shared/drawer/routes-configs/quest-config';
import RegisterConfig from '@/components/shared/drawer/routes-configs/register-config';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useTypedDispatch } from '@/hooks/use-store-hooks';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { logOutAsync } from '@/redux/state/auth/auth-state';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const dispatch = useTypedDispatch();
  const drawerStatus = useDrawerStatus();
  const { isCorrect: isAuthenticated } = useIsCorrectAccessToken();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const isDrawerOpen = drawerStatus === 'open';
  const logoutStyle = useTransformFade({ delay: 500, direction: 'right', isContentLoading: !isDrawerOpen, preventOpacity: true });

  const handleLogout = () => {
    dispatch(logOutAsync());
    router.navigate('/(not-authorized)/login');
    showSnackbar({ text: 'Logged off sucessfully!', variant: SnackbarVariantEnum.SUCCESS });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-2 py-4 flex flex-grow">
        <View className="flex items-end">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="p-[0.1] ml-auto">
            <Ionicons name="close" size={22} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex gap-4 flex-grow">
          {!isAuthenticated ? (
            <>
              <RegisterConfig />
              <LoginConfig />
            </>
          ) : (
            <>
              <DashboardConfig />
              <QuestConfig />
              <LeaderboardConfig />
              <NotificationsConfig />
              <ProfileConfig />
              <GoalConfig />
            </>
          )}
        </View>

        {isAuthenticated && (
          <Animated.View style={logoutStyle}>
            <Button
              startIcon={<Ionicons name="log-out-outline" size={20} color="white" />}
              onPress={handleLogout}
              label="Logout"
              className="px-6 mr-auto text-center"
            />
          </Animated.View>
        )}
      </View>
    </DrawerContentScrollView>
  );
};
