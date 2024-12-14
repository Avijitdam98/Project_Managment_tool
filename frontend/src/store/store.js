import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './boardSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    auth: authReducer,
    users: userReducer,
    theme: themeReducer,
  },
});

export default store;
