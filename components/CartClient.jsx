'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineTrash, HiOutlineShoppingBag, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';

const CartClient = () => {
  const { theme } = useTheme();
  const { cart, total, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  if (cart.length === 0) {
    return (
      <div className={`max-w-7xl mx-auto px-4 py-20 text-center ${theme.utilities.textPrimary}`}>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`w-24 h-24 ${theme.utilities.bgMuted} rounded-full flex items-center justify-center`}>
            <HiOutlineShoppingBag className={`text-4xl ${theme.utilities.textMuted}`} />
          </div>
          <div className="space-y-2">
            <h1 className={`text-3xl font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>Your Bag is Empty</h1>
            <p className={`${theme.utilities.textMuted} uppercase tracking-widest text-xs`}>Looks like you haven&apos;t added anything yet.</p>
          </div>
          <Link href="/products" className={`${theme.components.buttonPrimary} mt-8 px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase`}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 py-12 ${theme.utilities.textPrimary}`}>
      <h1 className={`text-3xl font-bold uppercase tracking-widest ${theme.utilities.textPrimary} mb-12 flex items-center`}>
        Your Shopping Bag <span className={`ml-4 text-sm font-normal ${theme.utilities.textMuted}`}>({cart.length} Items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className={`hidden md:grid grid-cols-6 gap-4 border-b ${theme.utilities.border} pb-4 text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>
            <div className="col-span-3">Product Details</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Price</div>
            <div className="text-right">Total</div>
          </div>

          {cart.map((item) => (
            <div key={`${item._id}-${item.selectedSize}-${item.selectedColor?.name}`} className={`grid grid-cols-1 md:grid-cols-6 gap-6 items-center border-b ${theme.utilities.border} pb-8`}>
              <div className="col-span-3 flex space-x-4">
                <div className={`relative w-24 h-32 flex-shrink-0 ${theme.utilities.bgMuted} border ${theme.utilities.border}`}>
                  <Image src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center space-y-1">
                  <h3 className={`text-sm font-bold uppercase tracking-tight ${theme.utilities.textPrimary}`}>{item.name}</h3>
                  <p className={`text-[10px] ${theme.utilities.textMuted} uppercase tracking-widest`}>
                    Size: <span className={`${theme.utilities.textPrimary} font-semibold`}>{item.selectedSize}</span> | 
                    Color: <span className={`${theme.utilities.textPrimary} font-semibold`}>{item.selectedColor?.name}</span>
                  </p>
                  <p className={`text-[10px] ${theme.utilities.textMuted} opacity-70 font-mono tracking-widest pt-1 uppercase`}>SKU: {item.sku}</p>
                  <button
                    onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor?.name)}
                    className={`flex items-center text-[10px] ${theme.utilities.textDanger} uppercase font-bold tracking-widest pt-4 hover:underline`}
                  >
                    <HiOutlineTrash className="mr-1" /> Remove
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className={`flex items-center border ${theme.utilities.border} rounded-sm overflow-hidden`}>
                  <button
                    onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity - 1)}
                    className={`w-10 h-10 flex items-center justify-center theme-hover-bg-muted transition-colors border-r ${theme.utilities.border}`}
                  >
                    <HiMinus className="text-xs" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity + 1)}
                    className={`w-10 h-10 flex items-center justify-center theme-hover-bg-muted transition-colors border-l ${theme.utilities.border}`}
                  >
                    <HiPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <div className={`hidden md:flex justify-center text-sm font-medium ${theme.utilities.textMuted}`}>
                Rs. {item.price.toLocaleString()}
              </div>

              <div className={`flex md:block justify-between items-center text-right font-bold ${theme.utilities.textPrimary}`}>
                <span className={`md:hidden text-[11px] uppercase ${theme.utilities.textMuted}`}>Subtotal:</span>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link href="/products" className={`inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 ${theme.utilities.border} pb-1 ${theme.components.link}`}>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={`${theme.utilities.bgSurface} p-8 sticky top-32 border ${theme.utilities.border} shadow-sm`}>
            <h2 className={`text-xl font-bold uppercase tracking-widest ${theme.utilities.textPrimary} mb-8`}>Order Summary</h2>

            <div className={`space-y-6 border-b ${theme.utilities.border} pb-8 mb-8 text-sm`}>
              <div className={`flex justify-between items-center ${theme.utilities.textSecondary}`}>
                <span className="uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">Rs. {total.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center ${theme.utilities.textSecondary}`}>
                <span className="uppercase tracking-widest">Shipping</span>
                <span className="font-bold text-green-600">Calculated later</span>
              </div>
              <div className={`flex justify-between items-center ${theme.utilities.textPrimary} pt-2 border-t ${theme.utilities.border}`}>
                <span className="uppercase tracking-widest font-extrabold">Grand Total</span>
                <span className="text-2xl font-bold">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              {!user && (
                <div className={`p-4 ${theme.utilities.bgMuted} border ${theme.utilities.border} text-[11px] ${theme.utilities.textDanger} uppercase tracking-widest font-bold text-center`}>
                  Please log in to proceed with checkout.
                </div>
              )}

              <Link
                href={user ? "/checkout" : "/login?redirect=/cart"}
                className={`w-full ${theme.components.buttonPrimary} h-14 flex items-center justify-center space-x-3 ${!user ? 'opacity-80' : ''}`}
              >
                <span>Process to Checkout</span>
                <HiArrowRight className="text-lg" />
              </Link>

              <div className="grid grid-cols-4 gap-4 pt-6">
                <div className={`aspect-[3/2] ${theme.utilities.bgSurface} border ${theme.utilities.border} flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all`}>
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={40} height={20} className="object-contain" />
                </div>
                <div className={`aspect-[3/2] ${theme.utilities.bgSurface} border ${theme.utilities.border} flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all`}>
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={20} className="object-contain" />
                </div>
                <div className={`aspect-[3/2] ${theme.utilities.bgSurface} border ${theme.utilities.border} flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all`}>
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={40} height={20} className="object-contain" />
                </div>
                <div className={`aspect-[3/2] ${theme.utilities.bgSurface} border ${theme.utilities.border} flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all`}>
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_logo%2C_revised_2016.svg" alt="Stripe" width={40} height={20} className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
