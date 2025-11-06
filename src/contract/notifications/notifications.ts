export interface NotificationDto {
  id: string;
  type: string;
  isRead: boolean;
  title: string;
  message: string;
  data?: unknown;
}

export interface GetNotificationsRequest {
  onlyUnread?: boolean;
}

export interface MarkNotificationReadRequest {
  id: string;
}

export type GetNotificationsResponse = NotificationDto[];
