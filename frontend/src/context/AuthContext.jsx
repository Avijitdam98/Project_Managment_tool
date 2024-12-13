import { createContext, useContext, useState, useEffect } from 'react';
import { login, register } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally, fetch user data here if needed
      setUser({ token }); // Set user state with token or user data
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    const data = await login(credentials);
    setUser(data.user);
  };

  const registerUser = async (userData) => {
    const data = await register(userData);
    setUser(data.user);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};