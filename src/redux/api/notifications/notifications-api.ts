import { GetNotificationsRequest, MarkNotificationReadRequest, GetNotificationsResponse } from '@/contract/notifications/notifications';
import Api from '@/redux/config/api';

export const notificationsApi = Api.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<GetNotificationsResponse, GetNotificationsRequest>({
      query: ({ onlyUnread }) => ({
        url: '/notifications',
        method: 'GET',
        params: { onlyUnread },
      }),
      providesTags: ['notifications'],
    }),

    markNotificationRead: builder.mutation<void, MarkNotificationReadRequest>({
      query: ({ id }) => ({
        url: `/notifications/${id}/mark-read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['notifications'],
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['notifications'],
    }),

    deleteNotification: builder.mutation<void, string>({
      query: id => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['notifications'],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation, useDeleteNotificationMutation } =
  notificationsApi;
