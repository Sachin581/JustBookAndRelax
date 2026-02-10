import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../../services/auth.service';

export default function ManageRoutes() {
    const [routes, setRoutes] = useState([]);
    const [newRoute, setNewRoute] = useState({ fromCity: '', toCity: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:8081/api/routes';

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const user = authService.getCurrentUser();
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(API_URL, config);
            setRoutes(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch routes');
        }
    };

    const handleAddRoute = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = authService.getCurrentUser();
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(API_URL, newRoute, config);
            setNewRoute({ fromCity: '', toCity: '' });
            fetchRoutes();
        } catch (err) {
            console.error(err);
            setError('Failed to create route');
        } finally {
            setLoading(false);
        }
    };

    const toggleRoute = async (id) => {
        try {
            const user = authService.getCurrentUser();
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/${id}/toggle`, {}, config);
            fetchRoutes();
        } catch (err) {
            console.error(err);
            setError('Failed to update route');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Routes</h1>

            {/* Add Route Form */}
            <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Route</h3>
                <form onSubmit={handleAddRoute} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">From City</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                            value={newRoute.fromCity}
                            onChange={(e) => setNewRoute({ ...newRoute, fromCity: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">To City</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                            value={newRoute.toCity}
                            onChange={(e) => setNewRoute({ ...newRoute, toCity: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Route'}
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Routes List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {routes.map((route) => (
                        <li key={route.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-primary-dark truncate">
                                    {route.fromCity} <span className="text-gray-500">→</span> {route.toCity}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Status: <span className={route.active ? "text-green-600" : "text-red-600"}>{route.active ? 'Active' : 'Disabled'}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => toggleRoute(route.id)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${route.active ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                            >
                                {route.active ? 'Disable' : 'Enable'}
                            </button>
                        </li>
                    ))}
                    {routes.length === 0 && (
                        <li className="px-6 py-4 text-center text-gray-500">No routes defined.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
