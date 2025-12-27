import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { Dropdown } from '@/components/shared/dropdown/dropdown';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useNotificationsWithHub } from '@/hooks/useNotificationsWithHub';

export const SettingsDropdown = () => {
  const { unreadCount } = useNotificationsWithHub();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const animatedStyle = useTransformFade({ direction: 'left' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownAnchorRef = useRef<View>(null);

  const menuItems = [
    {
      title: 'Profile',
      icon: 'person-outline' as const,
      route: '(authorized)/profile',
      testID: 'profile-button',
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline' as const,
      route: '(authorized)/notifications',
      testID: 'notifications-button',
      badge: unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-xs font-bold">{unreadCount}</Text>
        </View>
      ),
    },
    {
      title: 'Inventory',
      icon: 'cube-outline' as const,
      route: '(authorized)/inventory',
      testID: 'inventory-button',
    },
  ];

  return (
    <Animated.View style={animatedStyle} className="flex-row items-center">
      <View ref={dropdownAnchorRef}>
        <TouchableOpacity onPress={() => setIsDropdownOpen(true)} className="p-2 relative w-full">
          <Ionicons name="settings-outline" size={24} color="white" />
          {unreadCount > 0 && (
            <View
              className="absolute bg-red-500 rounded-full"
              style={{
                right: 6,
                top: 6,
                width: 10,
                height: 10,
              }}
            />
          )}
        </TouchableOpacity>
      </View>

      <Dropdown visible={isDropdownOpen} onDismiss={() => setIsDropdownOpen(false)} anchor={dropdownAnchorRef}>
        <View>
          {menuItems.map(item => (
            <Dropdown.Item
              key={item.title}
              title={item.title}
              onPress={() => {
                navigation.navigate(item.route);
                setIsDropdownOpen(false);
              }}
              leadingIcon={
                <View className="relative">
                  <Ionicons name={item.icon} size={20} color="black" />
                  {item.badge}
                </View>
              }
            />
          ))}
        </View>
      </Dropdown>
    </Animated.View>
  );
};
