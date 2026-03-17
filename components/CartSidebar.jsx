'use client';

import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { HiX, HiMinus, HiPlus, HiOutlineShoppingBag } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';

const CartSidebar = () => {
  const { cart, total, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const { theme } = useTheme();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md ${theme.utilities.bgSurface} ${theme.utilities.textPrimary} z-[110] shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-8 border-b ${theme.utilities.border}`}>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] flex items-center">
              <HiOutlineShoppingBag className="mr-3 text-2xl" /> 
              Your Bag
              <span className={`ml-4 ${theme.utilities.bgContrast} ${theme.utilities.textInverse} text-[10px] px-3 py-1 rounded-full font-bold shadow-lg`}>{cart.length}</span>
            </h2>
            <button onClick={() => setIsCartOpen(false)} className={`text-2xl hover:rotate-90 transition-transform duration-500 ${theme.utilities.textMuted} hover:${theme.utilities.textPrimary}`}>
              <HiX />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                <div className={`w-24 h-24 rounded-full ${theme.utilities.bgMuted} flex items-center justify-center`}>
                  <HiOutlineShoppingBag className="text-4xl" />
                </div>
                <p className={`uppercase tracking-[0.3em] text-xs font-bold ${theme.utilities.textMuted}`}>Your bag is currently empty</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className={`${theme.components.buttonOutline} py-4 px-10 text-[10px]`}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor?.name}`} className={`flex space-x-6 pb-8 border-b ${theme.utilities.border} last:border-0 last:pb-0`}>
                  <div className={`relative w-28 h-36 ${theme.utilities.bgMuted} flex-shrink-0 overflow-hidden ${theme.utilities.border}`}>
                    <Image 
                      src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} 
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-[11px] font-bold uppercase tracking-wider ${theme.utilities.textPrimary}`}>{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor?.name)}
                        className={`${theme.utilities.textMuted} hover:text-red-500 text-[10px] uppercase tracking-widest font-bold transition-colors`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className={`flex items-center gap-2 mt-2 text-[10px] ${theme.utilities.textMuted} uppercase tracking-widest font-medium`}>
                      <span>Size: <span className={theme.utilities.textPrimary}>{item.selectedSize}</span></span>
                      <span className="opacity-30">|</span>
                      <span>Color: <span className={theme.utilities.textPrimary}>{item.selectedColor?.name}</span></span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className={`flex items-center border ${theme.utilities.border} rounded-sm overflow-hidden`}>
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity - 1)}
                          className={`p-2 hover:${theme.utilities.bgMuted} transition-colors border-r ${theme.utilities.border}`}
                        >
                          <HiMinus className="text-[10px]" />
                        </button>
                        <span className="px-5 text-[11px] font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity + 1)}
                          className={`p-2 hover:${theme.utilities.bgMuted} transition-colors border-l ${theme.utilities.border}`}
                        >
                          <HiPlus className="text-[10px]" />
                        </button>
                      </div>
                      <span className={`font-bold text-sm tracking-wider ${theme.utilities.textPrimary}`}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className={`p-8 border-t ${theme.utilities.border} ${theme.utilities.bgMuted} space-y-6`}>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${theme.utilities.textMuted}`}>Subtotal</span>
                <span className={`text-xl font-bold tracking-widest ${theme.utilities.textPrimary}`}>Rs. {total.toLocaleString()}</span>
              </div>
              <p className={`text-[10px] ${theme.utilities.textMuted} uppercase tracking-widest italic opacity-70`}>Shipping & taxes calculated at checkout</p>
              <div className="grid grid-cols-1 gap-4 pt-2">
                <Link 
                  href="/cart" 
                  onClick={() => setIsCartOpen(false)}
                  className={`w-full ${theme.components.buttonOutline} py-5 text-[10px] tracking-[0.4em] font-bold text-center uppercase shadow-sm`}
                >
                  View Full Bag
                </Link>
                <Link 
                  href="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className={`w-full ${theme.components.buttonPrimary} py-5 text-[10px] tracking-[0.4em] font-bold text-center uppercase shadow-2xl`}
                >
                  Secure Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
