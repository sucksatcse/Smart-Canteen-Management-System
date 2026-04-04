import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Users, Building2 } from 'lucide-react';
import logo from '@/assets/000df3ee4acf3c460562d3cd8235bfa52accbd16.png';

export const AboutUsPage: React.FC = () => {
    const navigate = useNavigate();

    const teamMembers = [
        { name: 'Tanjim Islam', role: 'Team Member', emoji: '👨‍💻' },
        { name: 'Shuvrato Bhattacharjee', role: 'Team Member', emoji: '👨‍💻' },
        { name: 'Ashraful Islam', role: 'Team Member', emoji: '👨‍💻' },
        { name: 'Fahmid Ahmed', role: 'Team Member', emoji: '👨‍💻' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <img src={logo} alt="Smart Canteen" className="w-10 h-10" />
                        <span className="text-xl font-bold text-gray-900">Smart Canteen</span>
                    </button>
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </nav>

            {/* ── Header ── */}
            <section className="bg-gradient-to-br from-orange-500 to-red-500 py-16 px-6 shadow-inner text-center">
                <div className="max-w-4xl mx-auto text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                    <p className="text-lg md:text-xl text-orange-50 opacity-90 max-w-2xl mx-auto">
                        Dedicated to revolutionizing food management and serving the best experience perfectly blended with technology. 
                    </p>
                </div>
            </section>

            {/* ── Content ── */}
            <main className="max-w-7xl mx-auto w-full px-6 py-16 flex-1 grid md:grid-cols-2 gap-12 text-gray-800">
                
                {/* Left Column: Story & Team */}
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-2 mb-4 text-orange-600">
                            <Users className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">Our Story & Team</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Smart Canteen was founded with a single mission: to eliminate the friction from institutional dining. Whether it's the long queues, mismanaged inventory, or inaccurate billing, our vertically integrated platform connects kitchen staff, administrators, and customers smoothly.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {teamMembers.map((member, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                                    <div className="text-3xl">{member.emoji}</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                                        <p className="text-sm text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Contact & Office */}
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-orange-600">
                            <Building2 className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">Contact & Location</h2>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold px-0.5 text-gray-900 mb-1">Office Location</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Level 42, Tech Hub Building,<br/>
                                        Innovation Avenue,<br/>
                                        Dhaka 1213, Bangladesh
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg flex-shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                                    <p className="text-gray-600">+880 1234-567890</p>
                                </div>
                            </div>
                            
                            <hr className="border-gray-50" />

                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Email Support</h4>
                                    <p className="text-gray-600">hello@smartcanteen.app</p>
                                </div>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg flex-shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Working Hours</h4>
                                    <p className="text-gray-600">Sunday - Thursday, 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center mt-auto">
                <p className="text-sm">
                    © {new Date().getFullYear()} Smart Canteen &amp; Billing Management System.
                </p>
            </footer>
        </div>
    );
};
