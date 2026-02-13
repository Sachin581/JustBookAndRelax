
import { useEffect, useState } from 'react';
import userService from '../services/user.service';
import rideService from '../services/ride.service';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [offeredRides, setOfferedRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfile = await userService.getProfile();
                setProfile(userProfile);

                // Fetch offers only if role is appropriate, but for now fetch all
                const offers = await rideService.getMyOffers();
                setOfferedRides(offers);
            } catch (error) {
                console.error("Error loading profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading profile...</div>;
    if (!profile) return <div className="p-10 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary-dark h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex items-end -mt-12 mb-6">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl shadow-md">
                                {profile.name.charAt(0)}
                            </div>
                            <div className="ml-6 mb-1">
                                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                <p className="text-gray-500">{profile.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.role}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.joinedAt}</p>
                            </div>
                            {/* Stats placeholder */}
                        </div>
                    </div>
                </div>

                {/* Offered Rides Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">My Offered Rides</h2>
                    {offeredRides.length > 0 ? (
                        <div className="space-y-4">
                            {offeredRides.map(ride => (
                                <div key={ride.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-lg transition-shadow">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <span className="font-bold text-lg">{ride.source}</span>
                                            <span className="text-gray-400">➝</span>
                                            <span className="font-bold text-lg">{ride.destination}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex space-x-4">
                                            <span>📅 {new Date(ride.dateTime).toLocaleDateString()}</span>
                                            <span>⏰ {new Date(ride.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <p className="text-xl font-bold text-primary-dark">${ride.pricePerSeat}</p>
                                        <p className="text-sm text-gray-500">{ride.availableSeats} seats left</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">You haven't offered any rides yet.</p>
                            <a href="/offer-ride" className="text-primary-dark font-bold hover:underline">Offer a ride now</a>
                        </div>
                    )}
                </div>

                {/* Booked Rides Placeholder (Since we don't have booking logic yet) */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Trips</h2>
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                        <p className="text-gray-500">No past trips found.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
