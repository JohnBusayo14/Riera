import { useEffect } from 'react';
import PusherClient from '../services/PusherClient';

export const usePusherNotifications = (UserId, OnNotificationReceived) => {
  useEffect(() => {
    if (!UserId) return;

    // 1. Subscribe to the specific user channel defined in backend [cite: 2026-01-23]
    const ChannelName = `user-${UserId}`;
    const UserChannel = PusherClient.subscribe(ChannelName);

    // 2. Bind to the "ReceiveNotification" event
    UserChannel.bind('ReceiveNotification', (Data) => {
      console.log('New Notification Received:', Data);
      if (OnNotificationReceived) {
        OnNotificationReceived(Data);
      }
    });

    // 3. Cleanup on unmount
    return () => {
      PusherClient.unsubscribe(ChannelName);
    };
  }, [UserId, OnNotificationReceived]);
};