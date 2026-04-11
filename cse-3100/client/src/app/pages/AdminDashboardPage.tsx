import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  LogOut, DollarSign, ShoppingBag, Clock, AlertTriangle,
  TrendingUp, Package, Users, RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '@/lib/axios';

interface DashboardData {
  kpi: {
    todaySales: number;
    todayOrders: number;
    activeOrders: number;
    completedOrders: number;
    lowStockItems: number;
  };
  chartData: { date: string; sales: number; orders: number }[];
  popularItems: { name: string; orders: number }[];
  recentOrders: {
    id: string; customerName: string; totalAmount: number;
    status: string; createdAt: string; itemsCount: number;
  }[];
}

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/dashboard');
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const kpi = data?.kpi;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <RefreshCw className="w-3 h-3" />
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
            <button onClick={() => navigate('/admin/menu')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
              Manage Menu
            </button>
            <button onClick={() => navigate('/admin/inventory')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
              <Package className="w-4 h-4 inline mr-1" /> Inventory
            </button>
            <button onClick={() => navigate('/admin/salary')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium flex items-center gap-2">
              <Users className="w-4 h-4" /> Salary
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-5 h-5" /><span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Today's Revenue</span>
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">৳{(kpi?.todaySales ?? 0).toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Live from DB
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Today's Orders</span>
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi?.todayOrders ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Today only</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Active Orders</span>
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi?.activeOrders ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Pending + Preparing</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Completed</span>
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi?.completedOrders ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Low Stock</span>
                  <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi?.lowStockItems ?? 0}</p>
                <p className="text-xs text-red-600 mt-1">Need restock</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Revenue Trend (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data?.chartData ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => `৳${v.toFixed(2)}`} />
                    <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2}
                      dot={{ fill: '#f97316', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Most Popular Items</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data?.popularItems ?? []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order ID','Customer','Items','Total','Status','Time'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(data?.recentOrders ?? []).map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.customerName}</td>
                        <td className="px-4 py-3 text-sm">{order.itemsCount} items</td>
                        <td className="px-4 py-3 text-sm font-medium">৳{order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'ready'     ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
