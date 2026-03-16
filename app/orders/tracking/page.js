'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { HiOutlineSearch, HiOutlineCube, HiTruck, HiCheckCircle, HiChevronRight } from 'react-icons/hi';
import Image from 'next/image';

const TrackingContent = () => {
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

      {/* Search Bar */}
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
          {/* Status Tracker */}
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
            {/* Progress Bar Background */}
            <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-100 -z-0"></div>
            {/* Progress Bar Fill */}
            <div 
              className="absolute top-6 left-8 h-0.5 bg-[#A08C5B] transition-all duration-1000 -z-0"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="bg-gray-50 p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50] border-b pb-4">Order Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 uppercase tracking-widest">Order ID</span>
                  <span className="font-bold text-[#2C3E50]">{order.orderId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 uppercase tracking-widest">Date</span>
                  <span className="font-bold text-[#2C3E50]">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 uppercase tracking-widest">Payment Status</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-xs pt-4 border-t">
                  <span className="text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-lg font-bold text-[#2C3E50]">Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Summary */}
            <div className="bg-white border p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50] border-b pb-4">Shipping To</h3>
              <div className="text-xs text-gray-600 leading-relaxed uppercase tracking-wider space-y-2">
                <p className="font-bold text-[#2C3E50]">{order.user.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="border border-gray-100 p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50] mb-8">Items in Order</h3>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-6 pb-6 border-b last:border-0 last:pb-0">
                  <div className="relative w-16 h-20 bg-gray-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-[#2C3E50]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TrackingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
