import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { LogIn, ArrowLeft } from 'lucide-react';
import logoImage from '@/assets/000df3ee4acf3c460562d3cd8235bfa52accbd16.png';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registerSuccessMessage = useMemo(() => {
    const navState = location.state as { registered?: boolean } | null;
    return navState?.registered ? 'Registration successful. Please login.' : '';
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      const user = await login(email, password);
      if (user) {
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'staff') navigate('/staff/orders');
        else navigate('/customer/menu');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <img src={logoImage} alt="Smart Canteen Logo" className="w-20 h-20 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Canteen</h1>
          </button>
          <p className="text-gray-600 mt-2">Canteen Management System</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {registerSuccessMessage && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                {registerSuccessMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>



            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              {"Don't have an account? Register"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
