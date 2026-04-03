import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApp } from '@/app/contexts/AppContext';
import {
  ChefHat,
  LogOut,
  ArrowRight,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const StaffProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { orders } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Quick stats from orders
  const completedOrders = orders.filter(o => o.status === 'completed');
  const todayOrders = completedOrders.filter(o => {
    const d = new Date(o.updated_at);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });
  const totalRevenueServed = completedOrders.reduce((s, o) => s + Number(o.total_price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-500">Staff Account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-orange-400 to-orange-600" />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
                <span className="text-4xl">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Staff
              </span>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name ?? '—'}</h2>
            <p className="text-gray-500 text-sm mb-5">Canteen Staff Member</p>

            {/* Info rows */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Full Name</p>
                  <p className="text-sm font-semibold text-gray-900">{user?.name ?? '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900">{user?.email ?? '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {(user as any)?.phone ?? (user as any)?.phone_no ?? 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Served Today</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">৳{totalRevenueServed.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">Revenue Served</p>
          </div>
        </div>

        {/* Go to Orders Button */}
        <button
          onClick={() => navigate('/staff/orders')}
          className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-md group"
        >
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6" />
            <span>Go to Order Queue</span>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};
