import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApp } from '@/app/contexts/AppContext';
import { LogOut, Clock, ChefHat, CheckCircle, Hash, User } from 'lucide-react';

export const StaffOrderQueuePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useApp();
  const navigate = useNavigate();

  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'preparing'
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Live Order Queue</h2>
          <p className="text-gray-600">Manage incoming orders in real-time</p>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h2>
            <p className="text-gray-600">No active orders at the moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map(order => (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
                  order.status === 'pending' ? 'border-yellow-300' : 'border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'pending' ? 'New' : 'In Progress'}
                  </div>
                </div>

                {/* Table Number and Assigned Staff */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-purple-600" />
                      <p className="text-xs font-medium text-purple-700">Table</p>
                    </div>
                    <p className="text-lg font-bold text-purple-900">
                      {order.tableNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-medium text-blue-700">Staff</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">
                      {order.assignedStaff || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)} min ago
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Est. time: {order.estimatedTime} min
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Items:</p>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialNotes && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-orange-800 mb-1">Special Notes:</p>
                    <p className="text-sm text-orange-900">{order.specialNotes}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-bold text-orange-500">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Payment: {order.paymentMethod}
                  </div>
                </div>

                {order.status === 'pending' ? (
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
                  >
                    Accept Order
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};