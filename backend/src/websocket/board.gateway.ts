import { Socket } from 'socket.io';

export const setupBoardGateway = (socket: Socket) => {
  socket.on('board:join', (boardId: string) => {
    socket.join(`board:${boardId}`);
  });

  socket.on('board:leave', (boardId: string) => {
    socket.leave(`board:${boardId}`);
  });

  socket.on('task:move', (data: { boardId: string, taskId: string, newStatus: string, position: number }) => {
    // Broadcast to others in the board
    socket.to(`board:${data.boardId}`).emit('task:moved', data);
  });
};
