'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineTrash, HiOutlineShoppingBag, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';

const CartClient = () => {
  const { cart, total, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <HiOutlineShoppingBag className="text-4xl text-gray-300" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-[#2C3E50]">Your Bag is Empty</h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Looks like you haven&apos;t added anything yet.</p>
          </div>
          <Link href="/products" className="btn-primary mt-8">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-[#2C3E50] mb-12 flex items-center">
        Your Shopping Bag <span className="ml-4 text-sm font-normal text-gray-400">({cart.length} Items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="hidden md:grid grid-cols-6 gap-4 border-b pb-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">
            <div className="col-span-3">Product Details</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Price</div>
            <div className="text-right">Total</div>
          </div>

          {cart.map((item) => (
            <div key={`${item._id}-${item.selectedSize}-${item.selectedColor?.name}`} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center border-b pb-8">
              <div className="col-span-3 flex space-x-4">
                <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50">
                  <Image src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-tight">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    Size: <span className="text-black font-semibold">{item.selectedSize}</span> | 
                    Color: <span className="text-black font-semibold">{item.selectedColor?.name}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest pt-1 uppercase">SKU: {item.sku}</p>
                  <button
                    onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor?.name)}
                    className="flex items-center text-[10px] text-red-500 uppercase font-bold tracking-widest pt-4 hover:underline"
                  >
                    <HiOutlineTrash className="mr-1" /> Remove
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <HiMinus className="text-xs" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor?.name, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <HiPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="hidden md:flex justify-center text-sm font-medium text-gray-500">
                Rs. {item.price.toLocaleString()}
              </div>

              <div className="flex md:block justify-between items-center text-right font-bold text-[#2C3E50]">
                <span className="md:hidden text-[11px] uppercase text-gray-400">Subtotal:</span>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link href="/products" className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-[#A08C5B] hover:border-[#A08C5B] transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 sticky top-32 border border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#2C3E50] mb-8">Order Summary</h2>

            <div className="space-y-6 border-b pb-8 mb-8 text-sm">
              <div className="flex justify-between items-center text-gray-600">
                <span className="uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span className="uppercase tracking-widest">Shipping</span>
                <span className="font-bold text-green-600">Calculated later</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 pt-2 border-t">
                <span className="uppercase tracking-widest font-extrabold text-[#2C3E50]">Grand Total</span>
                <span className="text-2xl font-bold text-[#2C3E50]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              {!user && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 uppercase tracking-widest font-bold text-center">
                  Please log in to proceed with checkout.
                </div>
              )}

              <Link
                href={user ? "/checkout" : "/login?redirect=/cart"}
                className={`w-full btn-primary h-14 flex items-center justify-center space-x-3 ${!user ? 'opacity-80' : ''}`}
              >
                <span>Process to Checkout</span>
                <HiArrowRight className="text-lg" />
              </Link>

              <div className="grid grid-cols-4 gap-4 pt-6">
                <div className="aspect-[3/2] bg-white border flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={40} height={20} className="object-contain" />
                </div>
                <div className="aspect-[3/2] bg-white border flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={20} className="object-contain" />
                </div>
                <div className="aspect-[3/2] bg-white border flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={40} height={20} className="object-contain" />
                </div>
                <div className="aspect-[3/2] bg-white border flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
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
