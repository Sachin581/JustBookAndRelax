
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contentService from '../services/content.service';
import authService from '../services/auth.service';

export default function Home() {
    const [quotes, setQuotes] = useState([]);
    const navigate = useNavigate();
    // Search State
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    useEffect(() => {
        // Redirect logged-in users to dashboard
        const user = authService.getCurrentUser();
        if (user) {
            navigate('/dashboard');
            return;
        }
        // Fetch content for landing page
        contentService.getQuotes().then(setQuotes);
    }, [navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?from=${from}&to=${to}`);
    };

    return (
        <div className="bg-white min-h-screen">

            {/* 2. HERO SECTION */}
            <div className="relative bg-gradient-to-b from-primary via-primary-light to-white pb-20 pt-10 sm:pb-24 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
                            Your pick of rides at <span className="text-primary-dark">low prices</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Travel responsibly and comfortably. The perfect ride is just a search away.
                        </p>
                    </div>

                    {/* 3. MAIN SEARCH BAR (Card Style) */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-2 max-w-5xl mx-auto transform translate-y-4">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">

                            {/* Leaving From */}
                            <div className="relative w-full md:w-1/4 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-xl">⚪</span> {/* Circle Icon */}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Leaving from"
                                    className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="hidden md:block w-px h-10 bg-gray-200"></div> {/* Divider */}

                            {/* Going To */}
                            <div className="relative w-full md:w-1/4 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-xl">⚫</span> {/* Circle Icon */}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Going to"
                                    className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                            {/* Date */}
                            <div className="relative w-full md:w-1/5 group">
                                <input
                                    type="date"
                                    className="block w-full px-4 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                            {/* Passengers */}
                            <div className="relative w-full md:w-1/6 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">👤</span>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    max="4"
                                    className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900"
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                />
                            </div>

                            {/* Search Button */}
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

                {/* Decorative Element */}
                <div className="absolute bottom-0 w-full h-24 bg-white" style={{ clipPath: 'ellipse(70% 50% at 50% 100%)' }}></div>
            </div>

            {/* 4. TRUST / VALUE SECTION */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-50 hover:shadow-xl transition-shadow text-center md:text-left">
                            <div className="text-4xl mb-4 text-primary-dark">🌍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Travel everywhere</h3>
                            <p className="text-gray-500">From city centers to the smallest villages, find a ride that goes where you need to go.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-50 hover:shadow-xl transition-shadow text-center md:text-left">
                            <div className="text-4xl mb-4 text-primary-dark">💸</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Affordable prices</h3>
                            <p className="text-gray-500">No hidden fees. Book rides at prices that are easy on your wallet.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-50 hover:shadow-xl transition-shadow text-center md:text-left">
                            <div className="text-4xl mb-4 text-primary-dark">🛡️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ride with confidence</h3>
                            <p className="text-gray-500">Verified government IDs and community reviews ensure a safe journey.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. FEEDBACK / QUOTES SECTION */}
            <div className="bg-primary/20 py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Community love</h2>
                    <p className="mt-4 text-lg text-gray-600">See what travelers are saying about us.</p>
                </div>

                <div className="relative w-full overflow-hidden group">
                    <div className="flex animate-scroll gap-6 w-[200%] hover:pause">
                        {[...quotes, ...quotes, ...quotes].map((quote, i) => (
                            <div key={i} className="flex-shrink-0 w-96 bg-white p-8 rounded-2xl shadow-md border-l-4 border-primary-dark transform transition-transform hover:-translate-y-1">
                                <p className="text-gray-700 italic mb-6 text-lg">"{quote.text}"</p>
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                        {quote.author.charAt(0)}
                                    </div>
                                    <div className="ml-4 text-left">
                                        <p className="text-base font-bold text-gray-900">{quote.author}</p>
                                        <p className="text-sm text-primary-dark font-medium">{quote.role}</p>
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
