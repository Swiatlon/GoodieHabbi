import { FC } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationDto } from '@/contract/notifications/notifications';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface NotificationItemProps {
  notification: NotificationDto;
  onPress: () => void;
  onDelete?: (id: string) => void;
  isFetching?: boolean;
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification, onPress, onDelete, isFetching }) => {
  const animatedStyle = useTransformFade({});

  const handleToggleRead = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onPress();
  };

  const handleDelete = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (onDelete) onDelete(notification.id);
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
            <View className={`p-2.5 rounded-xl bg-white shadow-lg shadow-blue-200/50`}>
              <Ionicons
                name={notification.isRead ? 'checkmark-done-circle-outline' : 'mail-unread'}
                size={22}
                color={notification.isRead ? '#10B981' : '#3B82F6'}
              />
            </View>
          </View>

          <View className="flex-1 mr-2">
            <Text className={`text-base ${notification.isRead ? 'text-gray-600 font-normal' : 'text-gray-900 font-bold'}`} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text
              className={`text-[13px] leading-[19px] ${notification.isRead ? 'text-gray-500 font-normal' : 'text-gray-700 font-medium'}`}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
          </View>

          <View className="flex-row items-start">
            {!notification.isRead && (
              <TouchableOpacity
                onPress={handleToggleRead}
                disabled={isFetching}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="p-2 rounded-full mt-0.5 bg-white shadow-md shadow-blue-100"
              >
                <Ionicons name="checkmark-done" size={18} color="#10B981" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={isFetching}
              className="p-2 rounded-full mt-0.5 ml-2 bg-white shadow-md shadow-gray-200"
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
