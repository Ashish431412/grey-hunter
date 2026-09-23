import { useEffect } from 'react';
import socketService from '@services/socketService';

export const useSocket = (eventMap?: Record<string, (data: any) => void>) => {
  useEffect(() => {
    socketService.connect();

    if (eventMap) {
      Object.entries(eventMap).forEach(([event, handler]) => {
        socketService.subscribe(event, handler);
      });
    }

    return () => {
      if (eventMap) {
        Object.entries(eventMap).forEach(([event, handler]) => {
          socketService.unsubscribe(event, handler);
        });
      }
      // Depending on app architecture, we may not want to disconnect on unmount
      // if the socket is meant to be a global singleton.
    };
  }, [eventMap]);

  return socketService;
};
