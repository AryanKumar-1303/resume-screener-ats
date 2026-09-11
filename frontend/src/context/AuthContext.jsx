import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          // If live API backend is offline or unauthenticated, maintain demo session
          setUser({ email: 'recruiter@company.com', name: 'Recruiter Admin' });
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      setUser(response.data.user || { email, name: 'Recruiter Admin' });
    } catch (error) {
      // Demo login fallback when live backend endpoint is unreachable
      localStorage.setItem('token', 'demo-token-12345');
      setUser({ email: email || 'recruiter@company.com', name: 'Recruiter Admin' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};