import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import {
    ShoppingCart,
    ClipboardList,
    BarChart3,
    Bell,
    Users,
    Zap,
    CheckCircle,
    XCircle,
    ArrowRight,
    ChefHat,
    Receipt,
    PackageSearch,
    UserCircle,
} from 'lucide-react';
import logo from '@/assets/000df3ee4acf3c460562d3cd8235bfa52accbd16.png';

const problems = [
    { icon: XCircle, text: 'Manual order taking leading to delays and mistakes' },
    { icon: XCircle, text: 'Billing errors during peak hours' },
    { icon: XCircle, text: 'No real-time visibility of active or completed orders' },
    { icon: XCircle, text: 'Inefficient inventory tracking' },
    { icon: XCircle, text: 'Absence of analytics for sales and demand forecasting' },
];

const solutions = [
    { icon: ShoppingCart, text: 'Digital food ordering system' },
    { icon: Receipt, text: 'Automated and error-free billing' },
    { icon: ChefHat, text: 'Real-time kitchen order queue' },
    { icon: PackageSearch, text: 'Inventory monitoring with alerts' },
    { icon: Users, text: 'Role-based dashboards for Admin, Staff, and Customers' },
];

const features = [
    {
        icon: Zap,
        title: 'Smart Ordering',
        description: 'Digital menu with categories, real-time cart updates, and live order tracking.',
        color: 'bg-orange-50 text-orange-500',
    },
    {
        icon: Receipt,
        title: 'Automated Billing',
        description: 'Instant bill generation with multiple payment methods and strong order consistency.',
        color: 'bg-blue-50 text-blue-500',
    },
    {
        icon: ClipboardList,
        title: 'Kitchen Dashboard',
        description: 'Live order queue for staff with real-time WebSocket-powered status updates.',
        color: 'bg-green-50 text-green-500',
    },
    {
        icon: PackageSearch,
        title: 'Inventory Control',
        description: 'Automatic stock deduction, low-stock alerts, and detailed usage reports.',
        color: 'bg-purple-50 text-purple-500',
    },
    {
        icon: BarChart3,
        title: 'Analytics',
        description: 'Data-driven insights for sales trends and demand forecasting.',
        color: 'bg-pink-50 text-pink-500',
    },
    {
        icon: Bell,
        title: 'Real-Time Alerts',
        description: 'Instant notifications for orders, low stock, and operational events.',
        color: 'bg-yellow-50 text-yellow-500',
    },
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Redirect user back to their respective dashboard
    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'staff') return '/staff/orders';
        return '/customer/menu';
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo — clicking it comes back here */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <img src={logo} alt="Smart Canteen" className="w-10 h-10" />
                        <span className="text-xl font-bold text-gray-900">Smart Canteen</span>
                    </button>

                    {/* Right side: username or login button */}
                    {isAuthenticated && user ? (
                        <button
                            onClick={() => navigate(getDashboardPath())}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <UserCircle className="w-5 h-5" />
                            {user.name}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            id="home-login-btn"
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Login / Register
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                        <Zap className="w-4 h-4" />
                        Next-Generation Canteen Management
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                        Smart Canteen &{' '}
                        <span className="text-orange-500">Billing Management</span>{' '}
                        System
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        A complete digital canteen ecosystem that replaces manual workflows with
                        automated, real-time processes — reducing errors and boosting efficiency.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            id="hero-get-started-btn"
                            onClick={() => navigate(getDashboardPath())}
                            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Problem vs Solution ── */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Smart Canteen?</h2>
                        <p className="text-gray-500 text-lg">
                            Traditional canteens face real challenges. We solve them.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Problems */}
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
                                <XCircle className="w-6 h-6" /> The Problem
                            </h3>
                            <ul className="space-y-4">
                                {problems.map((p, i) => (
                                    <li key={i} className="flex items-start gap-3 text-red-800">
                                        <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" />
                                        <span>{p.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Solutions */}
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6" /> Our Solution
                            </h3>
                            <ul className="space-y-4">
                                {solutions.map((s, i) => (
                                    <li key={i} className="flex items-start gap-3 text-green-800">
                                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                                        <span>{s.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
                        <p className="text-gray-500 text-lg">Everything you need to run a modern canteen.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Target Industries ── */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Built For</h2>
                    <p className="text-gray-500 text-lg mb-10">
                        Designed as a Vertical SaaS platform for institutions that serve food at scale.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['University Canteens', 'Office Cafeterias', 'Hospital Food Courts', 'Event-Based Food Stalls'].map(
                            (industry) => (
                                <span
                                    key={industry}
                                    className="bg-orange-50 text-orange-700 border border-orange-200 px-5 py-2 rounded-full font-medium text-sm"
                                >
                                    {industry}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-6 bg-gradient-to-r from-orange-500 to-red-500">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to modernize your canteen?
                    </h2>
                    <p className="text-orange-100 text-lg mb-10">
                        Join now and experience seamless, digital canteen management.
                    </p>
                    <button
                        id="cta-login-btn"
                        onClick={() => navigate(getDashboardPath())}
                        className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-10 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                    >
                        {isAuthenticated ? 'Go to Dashboard' : 'Login / Register'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <img src={logo} alt="Smart Canteen" className="w-7 h-7 opacity-80" />
                    <span className="text-white font-semibold">Smart Canteen</span>
                </div>
                <p className="text-sm">
                    © {new Date().getFullYear()} Smart Canteen &amp; Billing Management System.
                    
                </p>
            </footer>
        </div>
    );
};
