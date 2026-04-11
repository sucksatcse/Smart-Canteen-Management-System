import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Search, Users, ShoppingBag, Shield, User, X } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
}

const roleStyles: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  staff: 'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="w-3.5 h-3.5" />,
  staff: <User className="w-3.5 h-3.5" />,
  customer: <ShoppingBag className="w-3.5 h-3.5" />,
};

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/admin/users');
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    const r = u.role?.toLowerCase() || 'unknown';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const totalOrders = users.reduce((s, u) => s + u.orderCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-sm text-gray-600">{users.length} registered users</p>
            </div>
          </div>
          <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between">
            {error} <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-green-600">{roleCounts['customer'] || 0}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Staff</p>
              <p className="text-2xl font-bold text-blue-600">{roleCounts['staff'] || 0}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-orange-600">{totalOrders}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', 'customer', 'staff', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
              {r !== 'all' ? ` (${roleCounts[r] || 0})` : ` (${users.length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['User', 'Email', 'Role', 'Phone', 'Orders', 'Joined'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleStyles[user.role?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                          {roleIcons[user.role?.toLowerCase()]}
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${user.orderCount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {user.orderCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
