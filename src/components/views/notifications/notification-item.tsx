import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { NotificationDto } from '@/contract/notifications/notifications';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface NotificationItemProps {
  notification: NotificationDto;
  onPress: () => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification, onPress }) => {
  const animatedStyle = useTransformFade({});

  const handleToggleRead = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onPress();
  };

  return (
    <Animated.View style={animatedStyle} className="mb-3">
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="relative overflow-hidden rounded-2xl">
        {!notification.isRead && <View className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600" />}

        <View
          className={`flex-row items-start p-4 ${
            notification.isRead ? 'bg-gray-50/30' : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30'
          }`}
        >
          <View className="relative mr-3.5 mt-0.5">
            <View className={`p-2.5 rounded-xl ${notification.isRead ? 'bg-gray-200/60' : 'bg-white shadow-lg shadow-blue-200/50'}`}>
              <Ionicons
                name={notification.isRead ? 'mail-open-outline' : 'mail-unread'}
                size={22}
                color={notification.isRead ? '#9CA3AF' : '#3B82F6'}
              />
            </View>

            {!notification.isRead && (
              <View className="absolute -top-0.5 -right-0.5">
                <View className="h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
                <View className="absolute inset-0 h-3 w-3 rounded-full bg-red-400 animate-ping opacity-75" />
              </View>
            )}
          </View>

          <View className="flex-1 mr-2">
            <View className="flex-row items-center mb-1">
              <Text className={`text-base flex-1 ${notification.isRead ? 'text-gray-600 font-normal' : 'text-gray-900 font-bold'}`} numberOfLines={1}>
                {notification.title}
              </Text>

              {!notification.isRead && (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-blue-500">
                  <Text className="text-[10px] font-bold text-white uppercase tracking-wide">New</Text>
                </View>
              )}
            </View>

            <Text
              className={`text-[13px] leading-[19px] ${notification.isRead ? 'text-gray-500 font-normal' : 'text-gray-700 font-medium'}`}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
          </View>

          {!notification.isRead && (
            <TouchableOpacity
              onPress={handleToggleRead}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="p-2 rounded-full mt-0.5 bg-white shadow-md shadow-blue-100"
            >
              <Ionicons name="checkmark-done" size={18} color="#10B981" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NotificationItem;
