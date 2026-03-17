'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineShoppingBag, HiOutlineChevronRight, HiOutlineClock } from 'react-icons/hi';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const OrdersClient = () => {
  const { theme } = useTheme();
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
    <div className={`max-w-6xl mx-auto px-4 py-20 min-h-screen ${theme.utilities.textPrimary}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className={`text-3xl font-bold uppercase tracking-[0.2em] ${theme.utilities.textPrimary}`}>My Purchases</h1>
          <p className={`text-xs ${theme.utilities.textMuted} mt-2 uppercase tracking-widest`}>View your order history and status</p>
        </div>
        <Link href="/products" className={`text-[10px] font-bold uppercase tracking-widest underline ${theme.components.link}`}>Continue Shopping</Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className={`border ${theme.utilities.border} ${theme.utilities.bgSurface} shadow-sm overflow-hidden group`}>
              <div className="p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center space-x-8">
                  <div className={`hidden sm:flex w-16 h-16 ${theme.utilities.bgMuted} rounded-full items-center justify-center ${theme.utilities.textPrimary}`}>
                    <HiOutlineShoppingBag className="text-2xl" />
                  </div>
                  <div className="space-y-2">
                    <p className={`text-[10px] font-bold ${theme.utilities.textMuted} uppercase tracking-widest`}>Order ID: {order.orderId}</p>
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary}`}>Placed on {new Date(order.createdAt).toLocaleDateString()}</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status}
                      </span>
                      <span className={`text-xs font-bold ${theme.utilities.textPrimary}`}>Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <Link
                    href={`/orders/tracking?id=${order.orderId}`}
                    className={`flex items-center justify-center space-x-2 px-8 py-4 ${theme.components.buttonPrimary} text-[10px] font-bold uppercase tracking-[0.2em] transition-all`}
                  >
                    <span>Track Order</span>
                    <HiOutlineChevronRight />
                  </Link>
                </div>
              </div>

              <div className={`px-6 py-4 flex items-center space-x-4 overflow-x-auto ${theme.utilities.bgMuted}`}>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${theme.utilities.textMuted} shrink-0`}>Items:</p>
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className={`flex-shrink-0 text-[10px] uppercase font-bold tracking-tight ${theme.utilities.textSecondary} ${theme.utilities.bgSurface} border ${theme.utilities.border} px-3 py-1`}>
                    {item.name} x {item.quantity}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className={`flex items-center text-[9px] uppercase tracking-widest ${theme.utilities.textMuted}`}>
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
          <div className={`w-20 h-20 rounded-full ${theme.utilities.bgMuted} flex items-center justify-center ${theme.utilities.textPrimary}`}>
            <HiOutlineShoppingBag className="text-3xl" />
          </div>
          <p className={`text-xs uppercase tracking-widest ${theme.utilities.textMuted}`}>No orders found yet.</p>
          <Link href="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersClient;
