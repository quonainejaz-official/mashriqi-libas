'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineShoppingBag, HiOutlineChartBar, HiOutlineCurrencyDollar, HiOutlineExclamationCircle } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    recentSales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mocking stats for now, in a real app these would come from an aggregation API
        const ordersRes = await axios.get('/api/admin/orders');
        const productsRes = await axios.get('/api/products?limit=100');
        
        const orders = ordersRes.data.orders || [];
        const products = productsRes.data.products || [];
        
        setStats({
          totalSales: orders.reduce((acc, o) => acc + o.total, 0),
          totalOrders: orders.length,
          totalProducts: products.length,
          lowStockItems: products.filter(p => p.stock <= 5).length,
          recentSales: orders.slice(0, 5)
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales (PKR)',
        data: [12000, 19000, 3000, 5000, 2000, 30000, 15000],
        backgroundColor: theme.colors.accent,
        borderRadius: 4,
      },
    ],
  };

  const statCards = [
    { label: 'Total Sales', value: `Rs. ${stats.totalSales.toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: 'bg-green-100 text-green-700' },
    { label: 'Total Orders', value: stats.totalOrders, icon: HiOutlineShoppingBag, color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Products', value: stats.totalProducts, icon: HiOutlineChartBar, color: 'bg-purple-100 text-purple-700' },
    { label: 'Low Stock', value: stats.lowStockItems, icon: HiOutlineExclamationCircle, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Dashboard Overview</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Real-time store performance</p>
        </div>
        <div className="hidden md:block text-[10px] font-bold uppercase tracking-widest bg-white border px-4 py-2">
          March 2024
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-none border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}>
              <card.icon className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{card.label}</p>
              <h3 className="text-xl font-bold text-[#2C3E50]">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50] mb-8">Sales Analytics</h3>
          <div className="h-64">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50] mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {stats.recentSales.length > 0 ? (
              stats.recentSales.map((order, idx) => (
                <div key={order._id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase">{order.orderId}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">Rs. {order.total.toLocaleString()}</p>
                    <p className={`text-[9px] uppercase font-bold ${order.status === 'delivered' ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex items-center justify-center text-center">
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest">No recent sales records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
