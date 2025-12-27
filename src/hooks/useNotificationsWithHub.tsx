import { useEffect, useRef } from 'react';
import { useNotifications } from '@/providers/notification-provider/notification-provider';
import { useGetNotificationsQuery } from '@/redux/api/notifications/notifications-api';

export const useNotificationsWithHub = () => {
  const { data: apiNotifications = [], refetch, isFetching, isLoading } = useGetNotificationsQuery({ onlyUnread: false });
  const { notifications: hubNotifications } = useNotifications();
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (hubNotifications.length === 0 || isFetching) return;

    const newNotifications = hubNotifications.filter(n => !seenIds.current.has(n.id));

    if (newNotifications.length === 0) return;

    newNotifications.forEach(n => seenIds.current.add(n.id));

    refetch();
  }, [hubNotifications, refetch, isFetching]);

  return {
    notifications: apiNotifications,
    unreadCount: apiNotifications.filter(n => !n.isRead).length,
    isFetching,
    isLoading,
  };
};
