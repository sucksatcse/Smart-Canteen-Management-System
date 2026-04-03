import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: string, contactNo: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setUser(null);
            return;
        }

        const response = await axios.get('/api/auth/me');
        if (response.data && response.data.id) {
          setUser(response.data);
        } else {
          setUser(null);
          localStorage.removeItem('jwt_token');
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('jwt_token');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.access_token) {
          localStorage.setItem('jwt_token', response.data.access_token);
          setUser(response.data.user);
          return response.data.user;
      }
      return null;
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) throw new Error('Incorrect email or password.');
      if (status === 422) throw new Error('Please enter a valid email and password.');
      throw new Error('Unable to sign in. Please try again.');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
    contactNo: string
  ): Promise<void> => {
    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        password,
        password_confirmation: password,
        role,
        contact_no: contactNo
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 400 || status === 422) {
        const data = error?.response?.data;
        if (data && typeof data === 'object') {
          const messages = Object.values(data).flat().join(' ');
          if (messages) throw new Error(messages);
        }
        throw new Error(data?.message || 'Please check your details and try again.');
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('jwt_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {/* Do not render app routes while initially fetching user session to prevent login flashes */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
