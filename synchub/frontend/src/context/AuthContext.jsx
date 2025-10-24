import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axiosInstance.get('/api/auth/me');
          setUser(res.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Detect device type and name
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const deviceType = isMobile ? 'phone' : 'laptop';
      const deviceName = isMobile ? `${navigator.platform} Phone` : `${navigator.platform} Computer`;
      
      const res = await axiosInstance.post('/api/auth/login', { 
        email, 
        password,
        device_name: deviceName,
        device_type: deviceType
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      showNotification('Login successful! Welcome back.', 'success');
    } catch (error) {
      showNotification('Login failed. Please check your credentials.', 'error');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      showNotification('Registration successful! Welcome to SyncHUB.', 'success');
    } catch (error) {
      showNotification('Registration failed. Please try again.', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
    showNotification('Logged out successfully. See you soon!', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
