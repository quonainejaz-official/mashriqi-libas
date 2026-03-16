'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="bottom-center" />
        {children}
      </CartProvider>
    </AuthProvider>
  );
};
