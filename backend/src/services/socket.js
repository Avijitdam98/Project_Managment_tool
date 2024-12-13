import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join board room
    socket.on('join-board', (boardId) => {
      socket.join(`board:${boardId}`);
      console.log(`User ${socket.userId} joined board ${boardId}`);
    });

    // Leave board room
    socket.on('leave-board', (boardId) => {
      socket.leave(`board:${boardId}`);
      console.log(`User ${socket.userId} left board ${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};

export const emitBoardUpdate = (boardId, updateType, data) => {
  if (io) {
    io.to(`board:${boardId}`).emit('board-update', {
      type: updateType,
      data,
    });
  }
};

export const emitTaskUpdate = (boardId, updateType, data) => {
  if (io) {
    io.to(`board:${boardId}`).emit('task-update', {
      type: updateType,
      data,
    });
  }
};
