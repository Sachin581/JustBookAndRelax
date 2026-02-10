
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rideService from '../services/ride.service';
import LocationInput from '../components/LocationInput';

export default function OfferRide() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureTime: '',
        price: '',
        seats: 1
    });
    const [loading, setLoading] = useState(false);
    const [availableCities, setAvailableCities] = useState([]);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            // Ideally should be a public endpoint or user-accessible
            const response = await import('axios').then(m => m.default.get('http://localhost:8081/api/routes/active'));
            const routes = response.data;
            const cities = new Set();
            routes.forEach(r => {
                cities.add(r.fromCity);
                cities.add(r.toCity);
            });
            setAvailableCities(Array.from(cities));
        } catch (error) {
            console.error("Failed to fetch routes", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await rideService.createRide(formData);
            navigate('/dashboard'); // Or profile to see offers
        } catch (error) {
            console.error("Failed to create ride", error);
            alert("Failed to publish ride. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 border-b-4 border-primary inline-block pb-2">Offer a Ride</h1>
                    <p className="mt-2 text-gray-500">Share your journey and save costs.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <LocationInput
                            placeholder="Leaving from"
                            value={formData.origin}
                            onChange={(val) => setFormData(prev => ({ ...prev, origin: val }))}
                            icon="⚪"
                            options={availableCities}
                        />
                        <LocationInput
                            placeholder="Going to"
                            value={formData.destination}
                            onChange={(val) => setFormData(prev => ({ ...prev, destination: val }))}
                            icon="⚫"
                            options={availableCities}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="departureTime"
                                required
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-dark focus:border-primary-dark py-3 px-4"
                                value={formData.departureTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                            <input
                                type="number"
                                name="seats"
                                min="1"
                                max="8"
                                required
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-dark focus:border-primary-dark py-3 px-4"
                                value={formData.seats}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Seat ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                required
                                className="pl-8 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-dark focus:border-primary-dark py-3"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-primary-dark hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-all transform hover:-translate-y-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Publishing...' : 'Publish Ride'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
