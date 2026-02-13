import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

export default function Dashboard() {
    const [user] = useState(authService.getCurrentUser());
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    // Mock Data for specific user stats
    const stats = [
        { label: 'Rides Taken', value: '12', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
        { label: 'Money Saved', value: '$450', icon: '💰', color: 'bg-green-100 text-green-600' },
        { label: 'CO₂ Saved', value: '85kg', icon: '🌱', color: 'bg-green-100 text-green-600' },
        { label: 'Rating', value: '4.8', icon: '⭐', color: 'bg-yellow-100 text-yellow-600' },
    ];

    const recentActivity = [
        { id: 1, type: 'Ride Taken', from: 'New York', to: 'Boston', date: 'Feb 10, 2026', status: 'Completed', price: '$45' },
        { id: 2, type: 'Ride Offered', from: 'Boston', to: 'New York', date: 'Feb 14, 2026', status: 'Scheduled', price: '$40' },
    ];

    return (
        <div className="bg-background-light min-h-screen font-sans text-gray-900">
            {/* 1. HERO SECTION */}
            <div className="bg-gradient-to-br from-primary via-[#6D2822] to-secondary text-white pb-32 pt-12 px-4 sm:px-6 lg:px-8 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl sm:truncate">
                                Welcome back, {user.name.split(' ')[0]}! 👋
                            </h2>
                            <p className="mt-2 text-red-50 text-lg opacity-90">
                                Experience luxury travel. Find a ride or offer one today.
                            </p>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="inline-flex items-center px-4 py-2 border border-white/20 rounded-xl shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all backdrop-blur-sm"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 space-y-8 pb-12">

                {/* 2. STATS OVERVIEW */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`rounded-lg p-3 ${stat.color} bg-opacity-10 text-2xl`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                                            <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. PRIMARY ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Book a Ride Card */}
                    <div
                        onClick={() => navigate('/search')}
                        className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-red-50 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                🔎
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">Book a Ride</h3>
                            <p className="text-gray-500 mb-6">Search for rides that match your schedule and budget. Travel comfortably.</p>
                            <span className="text-primary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                Find a Ride <span className="text-xl">→</span>
                            </span>
                        </div>
                    </div>

                    {/* Offer a Ride Card */}
                    <div
                        onClick={() => navigate('/offer-ride')}
                        className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-secondary rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-amber-50 text-secondary rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                                🚗
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">Offer a Ride</h3>
                            <p className="text-gray-500 mb-6">Driving somewhere? Share your empty seats, save costs, and meet new people.</p>
                            <span className="text-secondary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                Publish Ride <span className="text-xl">→</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. RECENT ACTIVITY */}
                <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <button className="text-sm text-primary font-medium hover:text-primary-hover">View All</button>
                    </div>
                    {recentActivity.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-red-50/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${activity.type === 'Ride Taken' ? 'bg-red-50 text-primary' : 'bg-amber-50 text-secondary'}`}>
                                            {activity.type === 'Ride Taken' ? '🎫' : '🚗'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{activity.from} → {activity.to}</p>
                                            <p className="text-xs text-gray-500">{activity.date} • {activity.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{activity.price}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No recent activity. Start your journey today!
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
