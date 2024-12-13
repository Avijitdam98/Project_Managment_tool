import { io } from 'socket.io-client';
import store from '../store/store';

let socket = null;

export const initSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('board-update', ({ type, data }) => {
    switch (type) {
      case 'board-updated':
        store.dispatch({ type: 'boards/boardUpdated', payload: data });
        break;
      case 'board-deleted':
        store.dispatch({ type: 'boards/boardDeleted', payload: data.boardId });
        break;
      case 'task-created':
      case 'task-updated':
        store.dispatch({ type: 'boards/taskUpdated', payload: data });
        break;
      default:
        console.log('Unhandled board update type:', type);
    }
  });

  return socket;
};

export const joinBoard = (boardId) => {
  if (socket) {
    socket.emit('join-board', boardId);
  }
};

export const leaveBoard = (boardId) => {
  if (socket) {
    socket.emit('leave-board', boardId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
