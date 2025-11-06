import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';
import { useGetNotificationsQuery } from '@/redux/api/notifications/notifications-api';

const NotificationsConfig = () => {
  const { data: notifications = [] } = useGetNotificationsQuery({});
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View className="relative">
      <CustomDrawerItem label="Notifications" icon={<Ionicons name="notifications-outline" />} route="(authorized)/notifications" />
      {unreadCount > 0 && (
        <View className="absolute right-0 top-0 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-xs font-bold">{unreadCount}</Text>
        </View>
      )}
    </View>
  );
};

export default NotificationsConfig;
