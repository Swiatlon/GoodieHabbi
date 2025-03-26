import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import Button from '../button/button';
import DashboardConfig from './routes-configs/dashboard-config';
import ProfileConfig from './routes-configs/profile-config';
import LoginConfig from '@/components/shared/drawer/routes-configs/login-config';
import QuestConfig from '@/components/shared/drawer/routes-configs/quest-config';
import RegisterConfig from '@/components/shared/drawer/routes-configs/register-config';
import { useTypedDispatch } from '@/hooks/use-store-hooks';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { logOutAsync } from '@/redux/state/auth/auth-state';
import { useIsCorrectAccessToken } from '@/utils/jwt-utils';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const dispatch = useTypedDispatch();
  const { isCorrect: isAuthenticated } = useIsCorrectAccessToken();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

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
              <ProfileConfig />
            </>
          )}
        </View>

        {isAuthenticated && (
          <Button
            startIcon={<Ionicons name="log-out-outline" size={20} color="white" />}
            onPress={handleLogout}
            label="Logout"
            className="px-6 mr-auto text-center"
          />
        )}
      </View>
    </DrawerContentScrollView>
  );
};
