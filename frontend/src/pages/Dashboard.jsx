
import { useEffect, useState } from 'react';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* 1. WELCOME SECTION */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="px-8 py-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    Welcome back, <span className="text-primary-dark">{user.name}</span>!
                                </h3>
                                <p className="text-gray-500 mt-2 text-lg mb-6">
                                    Where would you like to go today?
                                </p>

                                {/* Fake Search Bar Trigger */}
                                <div
                                    onClick={() => navigate('/search')}
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group max-w-2xl"
                                >
                                    <span className="text-xl">⚪</span>
                                    <span className="text-gray-400 font-medium group-hover:text-gray-600">Leaving from...</span>
                                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                                    <span className="text-xl">⚫</span>
                                    <span className="text-gray-400 font-medium group-hover:text-gray-600">Going to...</span>
                                    <div className="flex-grow"></div>
                                    <div className="bg-primary-dark text-white p-2 rounded-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PRIMARY ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Book a Ride */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-4">🔎</div>
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Book a Ride</h4>
                        <p className="text-gray-500 mb-6 flex-grow">Find a ride that matches your schedule and budget.</p>
                        <button
                            onClick={() => navigate('/search')}
                            className="w-full py-3 bg-primary-dark text-white font-bold rounded-xl shadow-md hover:bg-yellow-600 hover:shadow-lg transform active:scale-95 transition-all duration-200"
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Offer a Ride */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl mb-4">🚗</div>
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Offer a Ride</h4>
                        <p className="text-gray-500 mb-6 flex-grow">Driving somewhere? Share your empty seats and save costs.</p>
                        <button
                            onClick={() => navigate('/offer-ride')}
                            className="w-full py-3 bg-primary-dark text-white font-bold rounded-xl shadow-md hover:bg-yellow-600 hover:shadow-lg transform active:scale-95 transition-all duration-200"
                        >
                            Create Offer
                        </button>
                    </div>
                </div>

                {/* 3. RECENT ACTIVITY */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-xl text-gray-900">Recent Activity</h4>
                        <span className="text-sm text-primary-dark font-medium cursor-pointer hover:underline">View all</span>
                    </div>
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No recent activity found.</p>
                    </div>
                </div>

            </main>
        </div>
    );
}
