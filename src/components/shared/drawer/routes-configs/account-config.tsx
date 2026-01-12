import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';
import { useNotificationsWithHub } from '@/hooks/useNotificationsWithHub';

const ACTIVE_COLOR = '#007AFF';
const INACTIVE_COLOR = '#636363';

const AccountIcon = ({ hasUnread, color }: { hasUnread: boolean; color: string }) => (
  <View style={{ position: 'relative' }}>
    <Ionicons name="person-circle-outline" size={24} color={color} />
    {hasUnread && (
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: 'red',
        }}
      />
    )}
  </View>
);

const NotificationsIcon = ({ count, color }: { count: number; color: string }) => (
  <View style={{ position: 'relative' }}>
    <Ionicons name="notifications-outline" size={22} color={color} />
    {count > 0 && (
      <View
        style={{
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
          }}
        >
          {count}
        </Text>
      </View>
    )}
  </View>
);
const AccountConfig = () => {
  const { unreadCount } = useNotificationsWithHub();

  return (
    <CustomDrawerItem
      label="Account"
      icon={(active: boolean) => <AccountIcon hasUnread={unreadCount > 0} color={active ? ACTIVE_COLOR : INACTIVE_COLOR} />}
      items={[
        {
          label: 'Profile',
          route: '(authorized)/profile',
          icon: (active: boolean) => <Ionicons name="person-outline" size={22} color={active ? ACTIVE_COLOR : INACTIVE_COLOR} />,
        },
        {
          label: 'Notifications',
          route: '(authorized)/notifications',
          icon: (active: boolean) => <NotificationsIcon count={unreadCount} color={active ? ACTIVE_COLOR : INACTIVE_COLOR} />,
        },
        {
          label: 'Inventory',
          route: '(authorized)/inventory',
          icon: (active: boolean) => <Ionicons name="cube-outline" size={22} color={active ? ACTIVE_COLOR : INACTIVE_COLOR} />,
        },
      ]}
    />
  );
};

export default AccountConfig;
