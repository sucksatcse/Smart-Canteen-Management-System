import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApp } from '@/app/contexts/AppContext';
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useApp();
  const navigate = useNavigate();

  const userOrders = orders.filter(order => order.customerId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'preparing':
        return <AlertCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/customer/menu')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Your Orders</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {userOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start ordering to see your order history</p>
            <button
              onClick={() => navigate('/customer/menu')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                </div>

                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">
                        Estimated time: {order.estimatedTime} minutes
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      We're preparing your order. Thank you for your patience!
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialNotes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Special Notes:</strong> {order.specialNotes}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Payment: <span className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="text-xl font-bold text-orange-500">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};