import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, logoutApi } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      if (res.success) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerApi(name, email, password, role);
      if (res.success) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
