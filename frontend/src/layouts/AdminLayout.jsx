import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from '../services/auth.service';

export default function AdminLayout() {
    const navigate = useNavigate();
    const [user] = useState(authService.getCurrentUser());

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Admin Navbar */}
            <nav className="bg-gray-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-yellow-500">JustBlaBla Admin</span>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Dashboard</Link>
                                <Link to="/admin/routes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Manage Routes</Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-sm text-gray-400">Admin: {user.name}</span>
                            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
