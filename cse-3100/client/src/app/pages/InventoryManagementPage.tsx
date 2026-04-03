import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/contexts/AppContext';
import { ArrowLeft, AlertTriangle, Package, CheckCircle, XCircle } from 'lucide-react';

export const InventoryManagementPage: React.FC = () => {
  const { menuItems, updateMenuItem } = useApp();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleToggleAvailable = async (itemId: number, currentStatus: boolean) => {
    setUpdatingId(itemId);
    await updateMenuItem(itemId, { available: !currentStatus });
    setUpdatingId(null);
  };

  const hiddenItems = menuItems.filter(item => !item.available);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Items in Catalog</span>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{menuItems.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Hidden / Unavailable</span>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{hiddenItems.length}</p>
            <p className="text-sm text-orange-600 mt-1">Currently not visible to customers</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Availability Status</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Item Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-xl">
                            🍽️
                          </div>
                        )}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.available ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Hidden</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleToggleAvailable(item.id, item.available)}
                          disabled={updatingId === item.id}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            item.available
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          } disabled:opacity-50`}
                        >
                          {updatingId === item.id ? 'Updating...' : item.available ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
