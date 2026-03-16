'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Failed to parse cart:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage and calculate total
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (product, quantity = 1, selectedSize, selectedColor) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => 
          item._id === product._id && 
          item.selectedSize === selectedSize && 
          item.selectedColor?.name === selectedColor?.name
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return newCart;
      }

      toast.success(`Added ${product.name} to cart`);
      return [...prevCart, { ...product, quantity, selectedSize, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedSize, selectedColorName) => {
    setCart((prevCart) => 
      prevCart.filter(
        (item) => 
          !(item._id === productId && 
            item.selectedSize === selectedSize && 
            item.selectedColor?.name === selectedColorName)
      )
    );
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, selectedSize, selectedColorName, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) => 
      prevCart.map((item) => 
        (item._id === productId && 
         item.selectedSize === selectedSize && 
         item.selectedColor?.name === selectedColorName)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
