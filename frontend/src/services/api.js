import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Board APIs
export const getBoards = () => api.get('/boards');
export const getBoardDetails = (boardId) => api.get(`/boards/${boardId}`);
export const createBoard = (boardData) => api.post('/boards', boardData);
export const updateBoard = (boardId, boardData) => api.put(`/boards/${boardId}`, boardData);
export const deleteBoard = (boardId) => api.delete(`/boards/${boardId}`);

// Column APIs
export const createColumn = (boardId, columnData) => api.post(`/boards/${boardId}/columns`, columnData);
export const updateColumn = (boardId, columnId, columnData) => api.put(`/boards/${boardId}/columns/${columnId}`, columnData);
export const deleteColumn = (boardId, columnId) => api.delete(`/boards/${boardId}/columns/${columnId}`);

// Task APIs
export const createTask = (boardId, columnId, taskData) => api.post(`/boards/${boardId}/columns/${columnId}/tasks`, taskData);
export const updateTask = (boardId, columnId, taskId, taskData) => api.put(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, taskData);
export const deleteTask = (boardId, columnId, taskId) => api.delete(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
export const moveTask = (boardId, taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex) => 
  api.post(`/tasks/move`, {
    boardId,
    taskId,
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex
  });
export const updateTaskStatus = (taskId, statusData) => api.put(`/tasks/${taskId}/status`, statusData);

// User APIs
export const getUsers = () => api.get('/users');
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');

// Notification APIs
export const getNotifications = () => api.get('/notifications');
export const markNotificationAsRead = (notificationId) => api.put(`/notifications/${notificationId}/read`);
export const deleteNotification = (notificationId) => api.delete(`/notifications/${notificationId}`);

export default api;
