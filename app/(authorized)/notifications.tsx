import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/shared/button/button';
import FilterModal from '@/components/shared/config-modal/filter-modal';
import SortModal from '@/components/shared/config-modal/sort-modal';
import Loader from '@/components/shared/loader/loader';
import { NotificationsFilterMap, sortNotificationsOptions } from '@/components/views/notifications/constants/constants';
import { Header } from '@/components/views/notifications/header';
import { NotificationItem } from '@/components/views/notifications/notification-item';
import { NotificationDto } from '@/contract/notifications/notifications';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import { useFilter } from '@/hooks/use-filter/use-filter';
import { useSearch } from '@/hooks/use-search/use-search';
import { SortOrderEnum, useSort } from '@/hooks/use-sort/use-sort';
import { useNotificationsWithHub } from '@/hooks/useNotificationsWithHub';
import { useSnackbar } from '@/providers/snackbar/snackbar-context';
import {
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/redux/api/notifications/notifications-api';

export const Notifications: FC = () => {
  const { t } = useTranslation();
  const { notifications, isFetching, isLoading } = useNotificationsWithHub();
  const [markAsRead, { isLoading: isMarkAsRead }] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkAllRead }] = useMarkAllNotificationsReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const buttonsStyle = useTransformFade({ isContentLoading: isFetching, delay: 200 });
  const { showSnackbar } = useSnackbar();

  const isProcessing = useMemo(() => {
    return isMarkAsRead || isMarkAllRead || isDeleting || isFetching;
  }, [isMarkAsRead, isMarkAllRead, isDeleting, isFetching]);

  const {
    data: searchedData,
    searchQuery,
    isSearchVisible,
    setSearchQuery,
    setIsSearchVisible,
  } = useSearch({
    data: notifications,
  });

  const {
    data: filteredNotifications,
    setFilter,
    actualFilter,
  } = useFilter<NotificationDto>({
    secureStorageName: 'FilterNotifications',
    data: searchedData,
    initialFilter: { isRead: false },
  });

  const {
    data: sortedData,
    actualSortKey,
    actualSortOrder,
    setSortOrder,
    setSortKey,
    setSortObjKey,
  } = useSort({
    secureStorageName: 'SortNotifications',
    data: filteredNotifications,
    initialSort: {
      key: 'createdAt',
      objKey: 'createdAt',
      order: SortOrderEnum.DESC,
    },
  });

  const handleNotificationPress = async (notification: NotificationDto) => {
    if (!notification.isRead) {
      try {
        await markAsRead({ id: notification.id }).unwrap();
        showSnackbar({ text: t('notifications.markedAsReadSuccess'), variant: 'success' });
      } catch {
        showSnackbar({ text: t('notifications.markedAsReadError'), variant: 'error' });
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead().unwrap();
      showSnackbar({ text: t('notifications.markAllAsReadSuccess'), variant: 'success' });
    } catch {
      showSnackbar({ text: t('notifications.markAllAsReadError'), variant: 'error' });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      showSnackbar({ text: t('notifications.deletedSuccess'), variant: 'success' });
    } catch {
      showSnackbar({ text: t('notifications.deletedError'), variant: 'error' });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return <Loader message={t('notifications.loading')} fullscreen />;
  }

  if (notifications.length === 0) {
    return (
      <View className="flex-1 p-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-base text-center">{t('notifications.noNotificationsYet')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4" testID="notifications-screen">
      <Header
        unreadCount={unreadCount}
        isSearchVisible={isSearchVisible}
        searchQuery={searchQuery}
        setIsSearchVisible={setIsSearchVisible}
        setSearchQuery={setSearchQuery}
        setIsFilterModalVisible={setIsFilterModalVisible}
        setIsSortModalVisible={setIsSortModalVisible}
      />
      <FlatList
        data={sortedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            key={item.id}
            notification={item}
            onPress={async () => await handleNotificationPress(item)}
            onDelete={handleDeleteNotification}
            isFetching={isProcessing}
          />
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500">{t('notifications.noNotificationsFound')}</Text>}
        className="flex-1"
      />

      <FilterModal<NotificationDto>
        isVisible={isFilterModalVisible}
        setIsVisible={setIsFilterModalVisible}
        setFilter={setFilter}
        actualFilterData={actualFilter}
        title={t('notifications.filterTitle')}
        filterCategories={NotificationsFilterMap}
      />

      <SortModal
        isVisible={isSortModalVisible}
        setIsVisible={setIsSortModalVisible}
        actualSortKey={actualSortKey}
        setActualSortKeys={(key, objKey) => {
          setSortKey(key);
          setSortObjKey(objKey);
        }}
        title={t('notifications.sortTitle')}
        actualSortOrder={actualSortOrder}
        setSortOrder={setSortOrder}
        sortOptions={sortNotificationsOptions}
      />

      {unreadCount > 0 && (
        <Animated.View style={buttonsStyle} className="w-full h-[75px]">
          <Button
            label={t('notifications.markAllAsRead', { count: unreadCount })}
            onPress={handleMarkAllAsRead}
            className="absolute bottom-[14px] z-20 self-center"
            startIcon={<Ionicons name="checkmark-done" size={20} color="#fff" />}
            testID="btn-add-quest"
            disabled={isProcessing}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Notifications;
