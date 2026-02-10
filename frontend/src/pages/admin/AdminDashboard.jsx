import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../../services/auth.service';

export default function AdminDashboard() {
    // Mock stats for now, can be replaced with real API calls if endpoints exist
    const [stats, setStats] = useState({
        users: 0,
        drivers: 0,
        routes: 0,
        rides: 0
    });

    useEffect(() => {
        // Fetch stats if API exists, else mock
        // For now, let's just show some placeholders or fetch reachable counts
        // Example: Only fetching routes count
        const fetchStats = async () => {
            try {
                const user = authService.getCurrentUser();
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const routesRes = await axios.get('http://localhost:8081/api/routes', config);
                setStats(prev => ({ ...prev, routes: routesRes.data.length }));
            } catch (error) {
                console.error("Error fetching admin stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Routes" value={stats.routes} icon="🛣️" color="bg-blue-500" />
                <StatCard title="Total Users" value="-" icon="👥" color="bg-green-500" />
                <StatCard title="Total Drivers" value="-" icon="🚗" color="bg-purple-500" />
                <StatCard title="Active Rides" value="-" icon="⚡" color="bg-orange-500" />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-md p-3 ${color} text-white text-2xl`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
