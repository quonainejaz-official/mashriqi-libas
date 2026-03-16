'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { HiOutlineSearch, HiOutlineCube, HiTruck, HiCheckCircle, HiChevronRight } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';

const OrderTrackingClient = () => {
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">Track Your Order</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Enter your Order ID to see real-time status</p>
      </div>

      <div className="bg-white p-2 border border-gray-100 shadow-xl flex mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="ORD-YYYYMMDD-XXXX"
          className="flex-grow bg-transparent border-none px-6 py-4 text-sm focus:ring-0 outline-none uppercase"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
        />
        <button
          onClick={() => handleTrack()}
          className="bg-[#2C3E50] text-white px-8 h-14 uppercase tracking-widest text-[10px] font-bold hover:bg-black transition-all flex items-center space-x-2"
        >
          <span>Track</span>
          <HiOutlineSearch className="text-lg" />
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#A08C5B]"></div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Searching Archive...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 text-center text-red-600 text-sm uppercase tracking-widest font-bold animate-fadeIn">
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
                    ${idx <= currentStep ? 'bg-[#A08C5B] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}
                  `}>
                    <step.icon className="text-xl" />
                  </div>
                  <span className={`
                    text-[9px] uppercase tracking-widest font-bold mt-3
                    ${idx <= currentStep ? 'text-[#2C3E50]' : 'text-gray-400'}
                  `}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-0 right-0 h-[2px] bg-gray-100">
              <div
                className="h-[2px] bg-[#A08C5B] transition-all duration-700"
                style={{ width: `${Math.max(0, currentStep) * 33.33}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Order ID</p>
                <p className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">{order.orderId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Status</p>
                <p className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">{order.status}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Total</p>
                <p className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">Rs. {order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 border border-gray-100 p-4">
                  <div className="relative w-16 h-20 bg-gray-50">
                    <Image src={item.image || item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#2C3E50]">Rs. {item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/products" className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest gold-accent underline">
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
