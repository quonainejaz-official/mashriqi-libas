'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const { data } = await axios.get('/api/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          Cookies.remove('token');
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
      Cookies.set('token', data.token, { expires: 7 });
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
      Cookies.set('token', data.token, { expires: 7 });
      toast.success('Signup successful!');
      router.push('/profile');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
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
