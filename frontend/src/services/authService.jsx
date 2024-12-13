// authService.jsx
import api from './api';
import { toast } from 'react-toastify';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Login failed');
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Registration failed');
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`); // Adjust the API path if needed
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to fetch user profile');
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/profile', userData); // Adjust the API path if needed
    toast.success('Profile updated successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Profile update failed');
    throw error;
  }
};