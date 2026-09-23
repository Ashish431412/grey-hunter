import { Socket } from 'socket.io';

export const setupNotificationGateway = (socket: Socket) => {
  socket.on('subscribe:notifications', () => {
    socket.join(`user:${socket.data.userId}`);
  });

  socket.on('unsubscribe:notifications', () => {
    socket.leave(`user:${socket.data.userId}`);
  });
};
