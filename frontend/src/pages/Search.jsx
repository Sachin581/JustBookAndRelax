
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import rideService from '../services/ride.service';
import contentService from '../services/content.service';
import authService from '../services/auth.service';
import LocationInput from '../components/LocationInput';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [from, setFrom] = useState(searchParams.get('from') || '');
    const [to, setTo] = useState(searchParams.get('to') || '');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const [user, setUser] = useState(null);

    // Dynamic Routes State
    const [availableCities, setAvailableCities] = useState([]);

    useEffect(() => {
        // Check for current user
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Fetch testimonials
        contentService.getQuotes().then(setQuotes);

        // Fetch Active Routes for autocomplete
        // We'll extract unique cities from active routes
        // For simplicity, just fetch all routes and flatten unique cities
        fetchRoutes();

        // Auto-search if params exist
        if (from && to) {
            handleSearch(new Event('submit'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRoutes = async () => {
        try {
            // Ideally should be a public endpoint or user-accessible
            // Assuming /api/routes/active is public or we use auth token if logged in
            // Use axios directly or a service. Let's use axios for now or add to rideService
            // quick fix: use axios here
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

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!from || !to) return;

        try {
            const rides = await rideService.searchRides(from, to, date); // pass date if service supports it
            setResults(rides);
            setSearched(true);
            setSearchParams({ from, to });
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const handleBook = async (rideId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const userToken = authService.getCurrentUser();
            const config = { headers: { Authorization: `Bearer ${userToken.token}` } };
            // Call booking API
            await import('axios').then(m => m.default.post(`http://localhost:8081/api/bookings?rideId=${rideId}`, {}, config));

            alert("Ride booked successfully!");
            // Refresh results to update seats
            handleSearch();
        } catch (error) {
            console.error("Booking failed", error);
            alert("Booking failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="bg-white min-h-screen pb-12">

            {/* SEARCH HERO */}
            <div className="bg-primary/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Find a ride</h1>
                    {/* Resued Search Bar Style */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-2 max-w-5xl mx-auto">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
                            <div className="relative w-full md:w-1/4">
                                <LocationInput
                                    placeholder="Leaving from"
                                    value={from}
                                    onChange={setFrom}
                                    icon="⚪"
                                    options={availableCities}
                                />
                            </div>
                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>
                            <div className="relative w-full md:w-1/4">
                                <LocationInput
                                    placeholder="Going to"
                                    value={to}
                                    onChange={setTo}
                                    icon="⚫"
                                    options={availableCities}
                                />
                            </div>
                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>
                            <div className="relative w-full md:w-1/5 group">
                                <input
                                    type="date"
                                    className="block w-full px-4 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>
                            <div className="relative w-full md:w-1/6 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">👤</div>
                                <input
                                    type="number"
                                    min="1"
                                    max="4"
                                    className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900"
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-primary-dark hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all transform hover:scale-105"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* RESULTS & CONTENT */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {searched ? (
                    results.length > 0 ? (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">{results.length} rides available</h2>
                            {results.map(ride => (
                                <div key={ride.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center cursor-pointer group">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2">
                                            <span className="font-bold text-gray-900 text-lg">
                                                {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span>•</span>
                                            <span>{ride.origin}</span>
                                        </div>
                                        <div className="border-l-2 border-gray-300 ml-2 h-4 my-1"></div>
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                            <span className="font-bold text-gray-900 text-lg">
                                                {/* Mock arrival time + 2 hours */}
                                                {new Date(new Date(ride.departureTime).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span>•</span>
                                            <span>{ride.destination}</span>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold">
                                                {ride.driverName.charAt(0)}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">{ride.driverName}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0 text-right">
                                        <div className="text-2xl font-bold text-primary-dark">${ride.price}</div>
                                        <button
                                            onClick={() => handleBook(ride.id)}
                                            className="mt-2 px-6 py-2 bg-white border border-primary-dark text-primary-dark font-medium rounded-full hover:bg-primary-dark hover:text-white transition-colors"
                                        >
                                            Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-6xl mb-4">🛣️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No rides found yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                We couldn't find any rides for this route. Try changing your date or search for a nearby city.
                            </p>
                            {user ? (
                                <button
                                    onClick={() => navigate('/offer-ride')}
                                    className="px-8 py-3 bg-primary-dark text-white font-bold rounded-xl hover:bg-yellow-600 transition shadow-md"
                                >
                                    Offer a Ride
                                </button>
                            ) : (
                                <p className="text-sm text-gray-400">Driving this route? <a href="/login" className="text-primary-dark hover:underline">Log in</a> to offer a ride!</p>
                            )}
                        </div>
                    )
                ) : (
                    /* PRE-SEARCH CONTENT */
                    <div className="space-y-16">

                        {/* Popular Routes */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular rides nearby</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { from: 'Mumbai', to: 'Pune' },
                                    { from: 'Delhi', to: 'Agra' },
                                    { from: 'Bangalore', to: 'Mysore' }
                                ].map((route, i) => (
                                    <div key={i} onClick={() => { setFrom(route.from); setTo(route.to); }} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md cursor-pointer transition flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 group-hover:text-primary-dark transition text-xl">🚗</span>
                                            <div>
                                                <div className="font-bold text-gray-900">{route.from} <span className="text-gray-400">→</span> {route.to}</div>
                                            </div>
                                        </div>
                                        <div className="text-gray-400">›</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* How it Works */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your journey starts here</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔎</div>
                                    <h3 className="font-bold text-lg mb-2">Search</h3>
                                    <p className="text-gray-500 text-sm">Find the perfect ride from our wide network of trusted drivers.</p>
                                </div>
                                <div>
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
                                    <h3 className="font-bold text-lg mb-2">Book</h3>
                                    <p className="text-gray-500 text-sm">Reserve your seat instantly. Simple, secure, and fast.</p>
                                </div>
                                <div>
                                    <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎒</div>
                                    <h3 className="font-bold text-lg mb-2">Travel</h3>
                                    <p className="text-gray-500 text-sm">Share the road, save money, and make new friends along the way.</p>
                                </div>
                            </div>
                        </section>

                        {/* Trust */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
                            <div className="flex items-center gap-4 p-4">
                                <div className="text-3xl">🛡️</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Scam-free</h3>
                                    <p className="text-xs text-gray-500">Verified IDs and reviews.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4">
                                <div className="text-3xl">⚡</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Fast Booking</h3>
                                    <p className="text-xs text-gray-500">Book in seconds.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4">
                                <div className="text-3xl">🤝</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Community</h3>
                                    <p className="text-xs text-gray-500">Millions of happy travelers.</p>
                                </div>
                            </div>
                        </section>

                    </div>
                )}
            </div>

            {/* Testimonials (Reused) */}
            <div className="bg-primary/20 py-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Community love</h2>
                </div>
                <div className="relative w-full overflow-hidden">
                    <div className="flex animate-scroll gap-6 w-[200%]">
                        {[...quotes, ...quotes].map((quote, i) => (
                            <div key={i} className="flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <p className="text-gray-600 italic mb-4">"{quote.text}"</p>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-primary-dark/20 flex items-center justify-center text-primary-dark font-bold">
                                        {quote.author.charAt(0)}
                                    </div>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">{quote.author}</p>
                                        <p className="text-xs text-gray-500">{quote.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
