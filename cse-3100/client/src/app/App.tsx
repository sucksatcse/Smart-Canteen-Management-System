import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { AppProvider } from '@/app/contexts/AppContext';

import { HomePage } from '@/app/pages/HomePage';
import { AboutUsPage } from '@/app/pages/AboutUsPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/Register';
import { CustomerMenuPage } from '@/app/pages/CustomerMenuPage';
import { CartPage } from '@/app/pages/CartPage';
import { OrderStatusPage } from '@/app/pages/OrderStatusPage';
import { StaffOrderQueuePage } from '@/app/pages/StaffOrderQueuePage';
import { StaffProfilePage } from '@/app/pages/StaffProfilePage';
import { AdminDashboardPage } from '@/app/pages/AdminDashboardPage';
import { MenuManagementPage } from '@/app/pages/MenuManagementPage';
import { InventoryManagementPage } from '@/app/pages/InventoryManagementPage';
import { AdminSalaryPage } from '@/app/pages/AdminSalaryPage';
// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[]
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'staff') return <Navigate to="/staff/orders" replace />;
    return <Navigate to="/customer/menu" replace />;
  }

  return <>{children}</>;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Home — always public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUsPage />} />

      {/* Login / Register */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
              user?.role === 'staff' ? <Navigate to="/staff/orders" replace /> :
                <Navigate to="/customer/menu" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
              user?.role === 'staff' ? <Navigate to="/staff/orders" replace /> :
                <Navigate to="/customer/menu" replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customer/menu"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerMenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderStatusPage />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/orders"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffOrderQueuePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MenuManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <InventoryManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/salary"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSalaryPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  );
}
