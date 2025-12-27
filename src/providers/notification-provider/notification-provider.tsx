/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { selectCurrentToken } from '@/redux/state/auth/auth-state';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  pushNotification: (notification: Notification) => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

export const NotificationsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const pushNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  useEffect(() => {
    if (!token) return;

    const hub = new HubConnectionBuilder()
      .withUrl('https://goodiehabits.runasp.net/api/hubs/notifications', {
        accessTokenFactory: () => token,
        transport: 1,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(hub);

    hub.start();

    hub.on('ReceiveNotification', (notification: Notification) => {
      pushNotification(notification);
    });

    return () => {
      hub.stop();
    };
  }, [token]);

  return <NotificationsContext.Provider value={{ notifications, pushNotification }}>{children}</NotificationsContext.Provider>;
};
