import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const userToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const adminToken = localStorage.getItem('adminToken');
      const savedAdmin = localStorage.getItem('admin');

      if (userToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }

      if (adminToken && savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch (e) {
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // User Registration
  const register = async (userData) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return res;
  };

  // User Login
  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  // Admin Login (Separate Endpoint)
  const adminLogin = async (email, password) => {
    const res = await apiFetch('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token && res.user) {
      localStorage.setItem('adminToken', res.token);
      localStorage.setItem('admin', JSON.stringify(res.user));
      setAdmin(res.user);
    }
    return res;
  };

  // User Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  // Update user profile locally
  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        register,
        login,
        adminLogin,
        logout,
        adminLogout,
        updateUserState,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

