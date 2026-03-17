'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { HiOutlineSearch, HiOutlineCube, HiTruck, HiCheckCircle, HiChevronRight } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const OrderTrackingClient = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = useCallback(async (idToTrack, options = { silent: false }) => {
    const id = idToTrack || orderId;
    if (!id) return;
    if (!options.silent) {
      setLoading(true);
      setError('');
      setOrder(null);
    }
    try {
      const { data } = await axios.get(`/api/orders/track/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found. Please check your Order ID.');
    } finally {
      if (!options.silent) {
        setLoading(false);
      }
    }
  }, [orderId]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      handleTrack(id);
    }
  }, [searchParams, handleTrack]);

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(() => {
      handleTrack(orderId, { silent: true });
    }, 30000);
    return () => clearInterval(interval);
  }, [orderId, handleTrack]);

  const getStatusStep = (status) => {
    const steps = ['confirmed', 'packed', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  const currentStep = order ? getStatusStep(order.status) : -1;

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 ${theme.utilities.textPrimary}`}>
      <div className="text-center space-y-4 mb-12">
        <h1 className={`text-3xl font-bold uppercase tracking-[0.2em] ${theme.utilities.textPrimary}`}>Track Your Order</h1>
        <p className={`text-xs ${theme.utilities.textMuted} uppercase tracking-widest`}>Enter your Order ID to see real-time status</p>
      </div>

      <div className={`p-2 border shadow-xl flex mb-12 max-w-2xl mx-auto ${theme.utilities.bgSurface} ${theme.utilities.border}`}>
        <input
          type="text"
          placeholder="ORD-YYYYMMDD-XXXX"
          className={`flex-grow ${theme.components.input} border-none px-6 py-4 text-sm outline-none uppercase`}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
        />
        <button
          onClick={() => handleTrack()}
          className={`px-8 h-14 uppercase tracking-widest text-[10px] font-bold ${theme.components.buttonPrimary} flex items-center space-x-2`}
        >
          <span>Track</span>
          <HiOutlineSearch className="text-lg" />
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${theme.utilities.borderStrong}`}></div>
          <p className={`text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>Searching Archive...</p>
        </div>
      )}

      {error && (
        <div className={`p-6 text-center text-sm uppercase tracking-widest font-bold animate-fadeIn ${theme.utilities.bgMuted} ${theme.utilities.textDanger} border ${theme.utilities.border}`}>
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-12 animate-fadeIn">
          <div className="relative px-4 pb-12">
            <div className="flex items-center justify-between relative z-10">
              {[
                { label: 'Confirmed', icon: HiOutlineCube },
                { label: 'Packed', icon: HiOutlineCube },
                { label: 'Shipped', icon: HiTruck },
                { label: 'Delivered', icon: HiCheckCircle },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                    ${idx <= currentStep ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} shadow-lg` : `${theme.utilities.bgMuted} ${theme.utilities.textMuted}`}
                  `}>
                    <step.icon className="text-xl" />
                  </div>
                  <span className={`
                    text-[9px] uppercase tracking-widest font-bold mt-3
                    ${idx <= currentStep ? theme.utilities.textPrimary : theme.utilities.textMuted}
                  `}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className={`absolute top-6 left-0 right-0 h-[2px] ${theme.utilities.bgMuted}`}>
              <div
                className={`h-[2px] ${theme.utilities.bgContrast} transition-all duration-700`}
                style={{ width: `${Math.max(0, currentStep) * 33.33}%` }}
              ></div>
            </div>
          </div>

          <div className={`border p-8 ${theme.utilities.bgSurface} ${theme.utilities.border}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className={`text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>Order ID</p>
                <p className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>{order.orderId}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>Status</p>
                <p className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>{order.status}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>Total</p>
                <p className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>Rs. {order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className={`flex items-center space-x-4 border p-4 ${theme.utilities.border}`}>
                  <div className={`relative w-16 h-20 ${theme.utilities.bgMuted}`}>
                    <Image src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>{item.name}</p>
                    <p className={`text-[10px] uppercase tracking-widest ${theme.utilities.textMuted}`}>Qty: {item.quantity}</p>
                  </div>
                  <p className={`text-sm font-bold ${theme.utilities.textPrimary}`}>Rs. {item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/products" className={`inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest underline ${theme.components.link}`}>
              <span>Continue Shopping</span>
              <HiChevronRight />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingClient;
