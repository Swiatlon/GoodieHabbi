import { Ionicons } from '@expo/vector-icons';
import { IFilterMapValues } from '../../../shared/config-modal/filter-modal';
import { NotificationDto } from '@/contract/notifications/notifications';

export const NotificationsFilterMap = {
  Status: new Map([
    [
      'All',
      {
        filterMainKey: 'isRead' as keyof NotificationDto,
        value: null,
        icon: <Ionicons name="notifications" size={28} color="#9E9E9E" />,
        color: '#9E9E9E',
        label: 'All',
      },
    ],
    [
      'Read',
      {
        filterMainKey: 'isRead' as keyof NotificationDto,
        value: true,
        icon: <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />,
        color: '#4CAF50',
        label: 'Read',
      },
    ],
    [
      'Unread',
      {
        filterMainKey: 'isRead' as keyof NotificationDto,
        value: false,
        icon: <Ionicons name="notifications-circle" size={28} color="#F44336" />,
        color: '#F44336',
        label: 'Unread',
      },
    ],
  ]),
} as Record<string, Map<string, IFilterMapValues<NotificationDto>>>;
