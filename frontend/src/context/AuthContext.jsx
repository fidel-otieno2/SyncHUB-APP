import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post('/api/auth/register', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
