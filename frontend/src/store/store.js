import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './boardSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    auth: authReducer,
    users: userReducer,
  },
});

export default store;
