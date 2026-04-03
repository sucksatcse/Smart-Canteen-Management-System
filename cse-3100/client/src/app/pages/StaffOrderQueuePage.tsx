import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApp } from '@/app/contexts/AppContext';
import { LogOut, Clock, ChefHat, CheckCircle, RefreshCw, CheckSquare } from 'lucide-react';

export const StaffOrderQueuePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus, refreshOrders } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'live' | 'completed'>('live');

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const liveOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready'
  );

  const completedOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAcceptOrder = (orderId: number) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleCompleteOrder = (orderId: number) => {
    updateOrderStatus(orderId, 'completed');
  };

  // Staff stats: completed today by any staff (from the global orders list)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = completedOrders.filter(o => {
    if (o.status !== 'completed') return false;
    const d = new Date(o.updated_at);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  const revenueServedToday = completedToday.reduce((s, o) => s + Number(o.total_price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold">Staff Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshOrders()}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Refresh orders"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Stats Bar */}
      <div className="bg-orange-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Completed today:</span>
            <span className="font-bold text-gray-900">{completedToday.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Revenue served:</span>
            <span className="font-bold text-orange-600">৳{revenueServedToday.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">|</span>
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Active in queue:</span>
            <span className="font-bold text-blue-700">{liveOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Management</h2>
            <p className="text-gray-600">Track and serve meals efficiently.</p>
          </div>
          <div className="flex p-1 bg-gray-200 rounded-lg shrink-0 mt-4 sm:mt-0">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'live' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live Queue ({liveOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              History ({completedOrders.length})
            </button>
          </div>
        </div>

        {activeTab === 'live' && (
          <>
            {liveOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h2>
                <p className="text-gray-600">No active orders at the moment</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveOrders.map(order => (
                  <div
                    key={order.id}
                    className={`bg-white rounded-xl shadow-sm p-6 border-2 flex flex-col ${
                      order.status === 'pending'
                        ? 'border-yellow-300'
                        : order.status === 'preparing'
                        ? 'border-blue-300'
                        : 'border-green-400'
                    }`}
                  >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Order #{order.id}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'preparing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status === 'pending' ? 'New' : order.status === 'preparing' ? 'In Progress' : 'Ready to Serve'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)} min ago
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Items:</p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.menu_item?.name ?? `Item #${item.menu_item_id}`}
                      </span>
                      <span className="text-gray-500">
                        ৳{(Number(item.unit_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-orange-800 mb-1">Notes:</p>
                    <p className="text-sm text-orange-900">{order.notes}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-bold text-orange-500">
                      ৳{Number(order.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Accept Order
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      Complete Order <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
      )}

      {activeTab === 'completed' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {completedOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No completed orders yet today.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {completedOrders.map((order) => (
                <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">Order #{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                       <Clock className="w-3 h-3" /> {(new Date(order.updated_at)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">৳{Number(order.total_price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
