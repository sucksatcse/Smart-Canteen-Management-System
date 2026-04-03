import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApp } from '@/app/contexts/AppContext';
import { ShoppingCart, LogOut, Plus, Loader2 } from 'lucide-react';
import logo from '@/assets/000df3ee4acf3c460562d3cd8235bfa52accbd16.png';

type Category = 'all' | 'main' | 'snack' | 'drinks' | 'dessert';

const CATEGORIES: { id: Category; name: string }[] = [
  { id: 'all',     name: 'All Items' },
  { id: 'main',    name: 'Main Meals' },
  { id: 'snack',   name: 'Snacks' },
  { id: 'drinks',  name: 'Drinks' },
  { id: 'dessert', name: 'Desserts' },
];

export const CustomerMenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const { user, logout } = useAuth();
  const { menuItems, isMenuLoading, cart, addToCart } = useApp();
  const navigate = useNavigate();

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Smart Canteen" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Canteen</h1>
              <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/customer/orders')}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate('/customer/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Category Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Food Items Grid */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>

            {isMenuLoading ? (
              <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="text-lg">Loading menu…</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-orange-50 overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-5xl">🍽️</span>
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="font-semibold text-lg text-gray-900 mt-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-500">
                            ৳{Number(item.price).toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                              item.available
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            {item.available ? 'Add' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No items found in this category</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
