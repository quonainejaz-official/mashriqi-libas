'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HiOutlineUsers, 
  HiOutlineLockOpen, 
  HiOutlineLockClosed,
  HiOutlineSearch
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await axios.put('/api/admin/users', { userId, isBlocked: !isBlocked });
      toast.success(`User ${action}ed`);
      fetchUsers();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">User Management</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Customer Access Control</p>
      </div>

      <div className="bg-white p-4 border border-gray-100 shadow-sm flex items-center space-x-4">
        <div className="relative flex-grow max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-gray-50 border-none pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2C3E50] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold whitespace-nowrap">Contact</th>
              <th className="px-6 py-4 font-bold text-center">Status</th>
              <th className="px-6 py-4 font-bold text-center">Joined</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-100"></div></td>
                  <td className="px-6 py-4 text-center"><div className="h-6 w-20 bg-gray-100 mx-auto"></div></td>
                  <td className="px-6 py-4 text-center"><div className="h-4 w-20 bg-gray-100 mx-auto"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-10 bg-gray-100 ml-auto"></div></td>
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#2C3E50]">
                        {user.name[0]}
                      </div>
                      <p className="text-xs font-bold uppercase">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-0.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.email}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user.phone || 'No Phone'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[10px] uppercase tracking-widest text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                      className={`p-2 transition-all border ${user.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                      title={user.isBlocked ? 'Unblock User' : 'Block User'}
                    >
                      {user.isBlocked ? <HiOutlineLockOpen className="text-lg" /> : <HiOutlineLockClosed className="text-lg" />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400 text-xs uppercase tracking-widest italic">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
