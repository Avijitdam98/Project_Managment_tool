import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Board APIs
export const getBoards = () => api.get('/boards');
export const getBoardDetails = (boardId) => api.get(`/boards/${boardId}`);
export const createBoard = (boardData) => {
  const initialColumns = [
    { title: 'To Do', tasks: [] },
    { title: 'In Progress', tasks: [] },
    { title: 'Done', tasks: [] },
  ];

  const updatedBoardData = {
    ...boardData,
    columns: initialColumns,
    members: boardData.members || [],
    background: boardData.background || '#026AA7',
  };

  return api.post('/boards', updatedBoardData);
};
export const updateBoard = (boardId, updatedData) => api.patch(`/boards/${boardId}`, updatedData);
export const deleteBoard = (boardId) => api.delete(`/boards/${boardId}`);

// Task APIs
export const createTask = (boardId, columnId, taskData) =>
  api.post(`/boards/${boardId}/tasks`, { ...taskData, columnId });
export const updateTask = (taskId, taskData) => api.patch(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);
export const updateTaskStatus = (taskId, statusData) => api.patch(`/tasks/${taskId}`, statusData);

// Column APIs
export const createColumn = (boardId, columnData) => api.post(`/boards/${boardId}/columns`, columnData);
export const updateColumn = (boardId, columnId, columnData) =>
  api.patch(`/boards/${boardId}/columns/${columnId}`, columnData);
export const deleteColumn = (boardId, columnId) =>
  api.delete(`/boards/${boardId}/columns/${columnId}`);

// Member APIs
export const addBoardMember = (boardId, userId) =>
  api.post(`/boards/${boardId}/members`, { userId });
export const removeBoardMember = (boardId, userId) =>
  api.delete(`/boards/${boardId}/members/${userId}`);

export default api;