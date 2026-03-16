'use client';

import { useCart } from '@/context/CartContext';
import { HiX, HiMinus, HiPlus, HiOutlineShoppingBag } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';

const CartSidebar = () => {
  const { cart, total, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold uppercase tracking-widest flex items-center">
              <HiOutlineShoppingBag className="mr-2" /> Shopping Bag
              <span className="ml-2 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-2xl hover:rotate-90 transition-transform duration-300">
              <HiX />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <HiOutlineShoppingBag className="text-6xl text-gray-200" />
                <p className="text-gray-500 uppercase tracking-widest text-sm">Your bag is empty</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="btn-outline text-[12px] py-2 px-6"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor?.name}`} className="flex space-x-4 pb-6 border-b border-gray-50 last:border-0">
                  <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0">
                    <Image 
                      src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold uppercase tracking-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor?.name)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">
                      Size: <span className="text-black font-medium">{item.selectedSize}</span> | 
                      Color: <span className="text-black font-medium">{item.selectedColor?.name}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1 italic">SKU: {item.sku}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <HiMinus className="text-[12px]" />
                        </button>
                        <span className="px-4 text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <HiPlus className="text-[12px]" />
                        </button>
                      </div>
                      <span className="font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="uppercase text-sm tracking-widest font-bold">Subtotal</span>
                <span className="text-xl font-bold">Rs. {total.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-6 text-center italic">
                Shipping and taxes calculated at checkout
              </p>
              <Link 
                href="/checkout" 
                onClick={() => setIsCartOpen(false)}
                className="btn-primary w-full text-center block"
              >
                Checkout Now
              </Link>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center mt-4 text-[10px] uppercase tracking-widest font-bold hover:text-[#A08C5B] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
