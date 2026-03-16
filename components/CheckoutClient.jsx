'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import CheckoutForm from '@/components/CheckoutForm';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutClient = () => {
  const { cart, total } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState('');
  const [shippingOverrides, setShippingOverrides] = useState({
    name: null,
    phone: null,
    street: null,
    city: null,
    province: null,
    postalCode: null,
    country: null,
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [user, authLoading, cart, router]);

  const shippingAddress = {
    name: shippingOverrides.name ?? user?.name ?? '',
    phone: shippingOverrides.phone ?? user?.phone ?? '',
    street: shippingOverrides.street ?? user?.address?.street ?? '',
    city: shippingOverrides.city ?? user?.address?.city ?? '',
    province: shippingOverrides.province ?? user?.address?.province ?? '',
    postalCode: shippingOverrides.postalCode ?? user?.address?.postalCode ?? '',
    country: shippingOverrides.country ?? user?.address?.country ?? 'Pakistan',
  };

  const handleCreatePaymentIntent = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city) {
      return alert('Please fill in shipping details');
    }

    try {
      const { data } = await axios.post('/api/create-payment-intent', {
        amount: total + 200,
      });
      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (err) {
      console.error('Failed to create payment intent:', err);
      alert('Error initializing payment. Please try again.');
    }
  };

  if (authLoading || !user || cart.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A08C5B]"></div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2C3E50',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <div className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className={step === 1 ? 'text-[#2C3E50]' : 'text-gray-300'}>01 Shipping</span>
            <span className="w-8 h-px bg-gray-200"></span>
            <span className={step === 2 ? 'text-[#2C3E50]' : 'text-gray-300'}>02 Payment</span>
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Shipping Details</h2>
              <form onSubmit={handleCreatePaymentIntent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingOverrides((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Phone</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingOverrides((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Street Address</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingOverrides((prev) => ({ ...prev, street: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingOverrides((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Province</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={shippingAddress.province}
                    onChange={(e) => setShippingOverrides((prev) => ({ ...prev, province: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Postal Code</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingOverrides((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Country</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-gray-100 border-none p-4 text-sm outline-none cursor-not-allowed"
                    value={shippingAddress.country}
                  />
                </div>
                <button type="submit" className="md:col-span-2 btn-primary h-14 mt-4">
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-fadeIn space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Secure Payment</h2>
                <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase gold-accent underline">Edit Shipping</button>
              </div>
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                  <CheckoutForm shippingAddress={shippingAddress} clientSecret={clientSecret} />
                </Elements>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#1a1a1a] text-white p-8 md:p-12 sticky top-32">
            <h3 className="text-xl font-bold uppercase tracking-widest gold-accent mb-8">Summary</h3>

            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 mb-8">
              {cart.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} className="flex space-x-4">
                  <div className="relative w-16 h-20 bg-zinc-800">
                    <Image src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-tight line-clamp-1">{item.name}</h4>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    <p className="text-xs font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-zinc-800">
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span className="text-zinc-400">Subtotal</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest">
                <span className="text-zinc-400">Shipping</span>
                <span>Rs. 200</span>
              </div>
              <div className="flex justify-between text-xl font-bold gold-accent pt-4">
                <span>Total</span>
                <span>Rs. {(total + 200).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-12 space-y-4 text-[9px] text-zinc-500 uppercase tracking-[0.2em] text-center italic">
              <p>Secure SSL Encryption Active</p>
              <p>Free returns within 14 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
