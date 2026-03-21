import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Order, MenuItem, mockMenuItems, mockOrders } from '@/app/data/mockData';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders
  orders: Order[];
  createOrder: (paymentMethod: 'cash' | 'card' | 'online', specialNotes?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Menu Items
  menuItems: MenuItem[];
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Simulate real-time order status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.status === 'pending' && Math.random() > 0.7) {
            return { ...order, status: 'preparing' as const };
          }
          if (order.status === 'preparing' && Math.random() > 0.8) {
            return { ...order, status: 'completed' as const, estimatedTime: 0 };
          }
          return order;
        });
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const createOrder = (paymentMethod: 'cash' | 'card' | 'online', specialNotes?: string) => {
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: user?.id || 'guest',
      customerName: user?.name || 'Guest',
      items: [...cart],
      totalAmount: cartTotal,
      status: 'pending',
      createdAt: new Date(),
      estimatedTime: 25,
      paymentMethod,
      specialNotes
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status, estimatedTime: status === 'completed' ? 0 : order.estimatedTime }
          : order
      )
    );
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: String(menuItems.length + 1)
    };
    setMenuItems(prevItems => [...prevItems, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
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
        createOrder,
        updateOrderStatus,
        menuItems,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
