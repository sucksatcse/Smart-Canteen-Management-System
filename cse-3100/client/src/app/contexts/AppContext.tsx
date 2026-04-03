import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'snack' | 'drinks' | 'dessert';
  image_url: string | null;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  menu_item: MenuItem;
}

export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

// ─── Context Types ─────────────────────────────────────────────────────────────

interface AppContextType {
  // Cart (localStorage-backed)
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateCartQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders (API-backed)
  orders: Order[];
  isOrdersLoading: boolean;
  createOrder: (notes?: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: number, status: Order['status']) => Promise<void>;
  refreshOrders: () => Promise<void>;

  // Menu (API-backed)
  menuItems: MenuItem[];
  isMenuLoading: boolean;
  refreshMenu: () => Promise<void>;

  // Admin menu management (API-backed)
  addMenuItem: (item: Omit<MenuItem, 'id' | 'available'>) => Promise<void>;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: number) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Cart state (localStorage-backed for speed)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // API-backed state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ── Menu API ────────────────────────────────────────────────────────────────

  const refreshMenu = useCallback(async () => {
    setIsMenuLoading(true);
    try {
      const res = await axiosInstance.get('/api/menu');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setIsMenuLoading(false);
    }
  }, []);

  // ── Orders API ──────────────────────────────────────────────────────────────

  const refreshOrders = useCallback(async () => {
    setIsOrdersLoading(true);
    try {
      const res = await axiosInstance.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  // Hydrate data when user logs in, clear when user logs out
  useEffect(() => {
    if (user) {
      refreshMenu();
      if (user.role !== 'admin') { // Admin pulls all lazily
          refreshOrders();
      } else {
          refreshOrders(); // Admin might need orders immediately too
      }
    } else {
      setMenuItems([]);
      setOrders([]);
    }
  }, [user, refreshMenu, refreshOrders]);

  // ── Cart operations ─────────────────────────────────────────────────────────

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => c.id === itemId ? { ...c, quantity } : c));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ── Order operations ────────────────────────────────────────────────────────

  const createOrder = async (notes?: string): Promise<Order | null> => {
    try {
      const res = await axiosInstance.post('/api/orders', {
        items: cart.map(c => ({ menu_item_id: c.id, quantity: c.quantity })),
        notes: notes || null,
      });
      const newOrder: Order = res.data;
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    } catch (err) {
      console.error('Failed to place order:', err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      const res = await axiosInstance.put(`/api/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // ── Admin menu management ───────────────────────────────────────────────────

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'available'>) => {
    await axiosInstance.post('/api/menu', item);
    await refreshMenu();
  };

  const updateMenuItem = async (id: number, updates: Partial<MenuItem>) => {
    await axiosInstance.put(`/api/menu/${id}`, updates);
    await refreshMenu();
  };

  const deleteMenuItem = async (id: number) => {
    await axiosInstance.delete(`/api/menu/${id}`);
    await refreshMenu();
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        orders,
        isOrdersLoading,
        createOrder,
        updateOrderStatus,
        refreshOrders,
        menuItems,
        isMenuLoading,
        refreshMenu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
