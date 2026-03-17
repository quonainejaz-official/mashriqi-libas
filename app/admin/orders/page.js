'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HiOutlineShoppingBag, 
  HiOutlineTruck, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineExternalLink,
  HiX
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/orders');
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating status...');
    try {
      await axios.put(`/api/admin/orders/${selectedOrder.orderId}/status`, {
        status: statusUpdate.status,
        note: statusUpdate.note
      });
      toast.success('Order status updated', { id: loadingToast });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error('Update failed', { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'packed': return 'bg-amber-100 text-amber-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Order Management</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Track Fulfillment & Delivery</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2C3E50] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-bold">Order ID</th>
              <th className="px-6 py-4 font-bold">Customer</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-center">Amount</th>
              <th className="px-6 py-4 font-bold text-center">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100"></div></td>
                  <td className="px-6 py-4 text-center"><div className="h-4 w-16 bg-gray-100 mx-auto"></div></td>
                  <td className="px-6 py-4 text-center"><div className="h-6 w-20 bg-gray-100 mx-auto"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-10 bg-gray-100 ml-auto"></div></td>
                </tr>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[10px] tracking-widest uppercase text-[#2C3E50]">{order.orderId}</td>
                  <td className="px-6 py-4 space-y-0.5">
                    <p className="text-xs font-bold uppercase">{order.user?.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-[#2C3E50]">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedOrder(order); setStatusUpdate({ status: order.status, note: '' }); }}
                      className="p-2 text-[#A08C5B] hover:bg-gray-50 transition-all border"
                    >
                      <HiOutlineExternalLink className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-gray-400 text-xs uppercase tracking-widest italic">No orders recorded in the system.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details/Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl p-10 animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-xl font-bold uppercase tracking-widest">Order Details: {selectedOrder.orderId}</h2>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 border border-gray-200 hover:bg-gray-50 transition-all"
                aria-label="Close order details"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b pb-2">Customer Info</h3>
                  <div className="text-xs font-bold uppercase tracking-widest space-y-2">
                    <p>{selectedOrder.user?.name}</p>
                    <p className="font-normal text-gray-500">{selectedOrder.user?.email}</p>
                    <p className="font-normal text-gray-500">{selectedOrder.user?.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b pb-2">Shipping Address</h3>
                  <div className="text-xs uppercase tracking-widest text-[#2C3E50] leading-relaxed">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 space-y-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b pb-2">Update Order Status</h3>
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <select 
                    className="w-full bg-white border-none p-4 text-xs uppercase tracking-widest font-bold focus:ring-1 focus:ring-[#A08C5B] outline-none"
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <textarea 
                    placeholder="Add a progress note..."
                    rows="2"
                    className="w-full bg-white border-none p-4 text-[11px] uppercase tracking-widest focus:ring-1 focus:ring-[#A08C5B] outline-none resize-none"
                    value={statusUpdate.note}
                    onChange={(e) => setStatusUpdate({...statusUpdate, note: e.target.value})}
                  ></textarea>
                  <button type="submit" className="w-full btn-primary h-12 flex items-center justify-center space-x-2">
                    <HiOutlineCheckCircle />
                    <span className="text-[10px]">Update Order</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b pb-2">Items Ordered</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[10px]">
                        {item.quantity}x
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase">{item.name}</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest tracking-tighter">SKU: {item.sku} | Size: {item.size}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
