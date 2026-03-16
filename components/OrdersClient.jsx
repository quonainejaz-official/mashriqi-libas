'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineShoppingBag, HiOutlineChevronRight, HiOutlineClock } from 'react-icons/hi';
import Link from 'next/link';

const OrdersClient = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A08C5B]"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">My Purchases</h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">View your order history and status</p>
        </div>
        <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest underline gold-accent">Continue Shopping</Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group">
              <div className="p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center space-x-8">
                  <div className="hidden sm:flex w-16 h-16 bg-[#F9F9F9] rounded-full items-center justify-center text-[#2C3E50]">
                    <HiOutlineShoppingBag className="text-2xl" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: {order.orderId}</p>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">Placed on {new Date(order.createdAt).toLocaleDateString()}</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status}
                      </span>
                      <span className="text-xs font-bold text-[#2C3E50]">Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <Link
                    href={`/orders/tracking?id=${order.orderId}`}
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-[#2C3E50] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all"
                  >
                    <span>Track Order</span>
                    <HiOutlineChevronRight />
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex items-center space-x-4 overflow-x-auto">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 shrink-0">Items:</p>
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 text-[10px] uppercase font-bold tracking-tight text-gray-500 bg-white border px-3 py-1">
                    {item.name} x {item.quantity}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center text-[9px] uppercase tracking-widest text-gray-400">
                    <HiOutlineClock className="mr-1" />
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-[#2C3E50]">
            <HiOutlineShoppingBag className="text-3xl" />
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400">No orders found yet.</p>
          <Link href="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersClient;
