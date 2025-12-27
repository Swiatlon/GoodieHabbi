import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerItem from '../elements/custom-drawer-item';
import { useNotificationsWithHub } from '@/hooks/useNotificationsWithHub';

const AccountIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <View style={{ position: 'relative' }}>
    <Ionicons name="person-circle-outline" size={26} />
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

const NotificationsIcon = ({ count }: { count: number }) => (
  <View style={{ position: 'relative' }}>
    <Ionicons name="notifications-outline" size={22} />
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
        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{count}</Text>
      </View>
    )}
  </View>
);
const AccountConfig = () => {
  const { unreadCount } = useNotificationsWithHub();

  return (
    <CustomDrawerItem
      label="Account"
      icon={<AccountIcon hasUnread={unreadCount > 0} />}
      items={[
        {
          label: 'Profile',
          icon: <Ionicons name="person-outline" size={22} />,
          route: '(authorized)/profile',
        },
        {
          label: 'Notifications',
          icon: <NotificationsIcon count={unreadCount} />,
          route: '(authorized)/notifications',
        },
        {
          label: 'Inventory',
          icon: <Ionicons name="cube-outline" size={22} />,
          route: '(authorized)/inventory',
        },
      ]}
    />
  );
};
export default AccountConfig;
