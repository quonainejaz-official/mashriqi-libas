'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }
  delete axios.defaults.headers.common.Authorization;
};

if (typeof window !== 'undefined') {
  const existingToken = localStorage.getItem('token');
  if (existingToken) {
    setAuthHeader(existingToken);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          setAuthHeader(token);
          const { data } = await axios.get('/api/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setAuthHeader(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data.user);
      localStorage.setItem('token', data.token);
      setAuthHeader(data.token);
      toast.success('Login successful!');
      router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/profile');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/signup', userData);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      setAuthHeader(data.token);
      toast.success('Signup successful!');
      router.push('/profile');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    const token = getStoredToken();
    if (token) {
      setAuthHeader(token);
      try {
        await axios.post('/api/auth/me');
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    localStorage.removeItem('token');
    setAuthHeader(null);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const updateProfile = async (payload) => {
    try {
      const { data } = await axios.put('/api/auth/me', payload);
      setUser(data.user);
      toast.success('Profile updated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
