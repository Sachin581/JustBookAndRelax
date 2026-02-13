import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import rideService from '../services/ride.service';
import authService from '../services/auth.service';

export default function BookingPage() {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Booking Form State
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [seats, setSeats] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchRideDetails();
    }, [rideId]);

    const fetchRideDetails = async () => {
        try {
            const data = await rideService.getRideById(rideId);
            setRide(data);
        } catch (err) {
            console.error("Fetch ride error FULL:", err);
            const status = err.response ? err.response.status : 'No Response';
            const msg = err.response?.data?.message || err.message;
            setError(`Failed to load ride details. Status: ${status}, Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        // Requirement: User 'must select exactly ONE'.
        // We enforce this. If the ride has no points, we cannot fulfill the requirement,
        // so we should probably alert the user or disable the button.

        if (!selectedPickup) {
            alert("Please select a pickup point.");
            return;
        }
        if (!selectedDrop) {
            alert("Please select a drop-off point.");
            return;
        }

        if (confirm(`Confirm booking for ${seats} seat(s)? Total: $${(ride.pricePerSeat * seats).toFixed(2)}`)) {
            setBookingLoading(true);
            try {
                const userToken = authService.getCurrentUser();
                // Ensure we handle case where user might not be logged in (though protected route should catch this)
                if (!userToken || !userToken.token) {
                    alert("You must be logged in to book a ride.");
                    navigate('/login');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${userToken.token}` } };

                await import('axios').then(m => m.default.post(`http://localhost:8081/api/bookings`, {
                    rideId: ride.id,
                    seats: parseInt(seats),
                    pickupPointId: selectedPickup,
                    dropPointId: selectedDrop
                }, config));

                alert("Ride booked successfully!");
                navigate('/dashboard');
            } catch (err) {
                console.error("Booking error", err);
                // improved error message handling
                const errorMsg = err.response?.data?.message || err.message || "Unknown error";
                alert("Booking failed: " + errorMsg);
            } finally {
                setBookingLoading(false);
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-yellow-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-yellow-50 text-red-500 font-bold">
            {error}
        </div>
    );

    if (!ride) return null;

    // Check if booking is possible (must have points and seats)
    const canBook = ride.availableSeats > 0 &&
        ride.pickupPoints && ride.pickupPoints.length > 0 &&
        ride.dropPoints && ride.dropPoints.length > 0;

    return (
        <div className="bg-yellow-50 min-h-screen py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-primary p-6 text-white text-center">
                    <h1 className="text-3xl font-extrabold">Complete Your Booking</h1>
                    <p className="opacity-90 mt-2">Ride with {ride.driverName}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Ride Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold text-gray-800">{ride.source} <span className="text-primary">➝</span> {ride.destination}</h2>
                            <p className="text-gray-500 mt-1">📅 {new Date(ride.dateTime).toLocaleString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-primary-dark">${ride.pricePerSeat}</p>
                            <p className="text-sm text-gray-400">per seat</p>
                        </div>
                    </div>

                    {/* Pickup Selection */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Select Pickup Point <span className="text-red-500">*</span></h3>
                        <div className="space-y-3">
                            {ride.pickupPoints && ride.pickupPoints.length > 0 ? (
                                ride.pickupPoints.map(point => (
                                    <label key={point.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPickup === point.id ? 'border-primary bg-yellow-50 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="pickup"
                                            value={point.id}
                                            checked={selectedPickup === point.id}
                                            onChange={() => setSelectedPickup(point.id)}
                                            className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <div className="ml-3">
                                            <div className="font-medium text-gray-900">{point.locationName}</div>
                                            <div className="text-sm text-gray-500">{point.address}</div>
                                            <div className="text-xs text-primary-dark mt-1">Time: {new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </label>
                                ))) : (
                                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                                    <p className="font-bold">❌ No pickup points available.</p>
                                    <p className="text-sm">This ride cannot be booked because the driver hasn't set any pickup points.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Drop Selection */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Select Drop-off Point <span className="text-red-500">*</span></h3>
                        <div className="space-y-3">
                            {ride.dropPoints && ride.dropPoints.length > 0 ? (
                                ride.dropPoints.map(point => (
                                    <label key={point.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedDrop === point.id ? 'border-primary bg-yellow-50 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="drop"
                                            value={point.id}
                                            checked={selectedDrop === point.id}
                                            onChange={() => setSelectedDrop(point.id)}
                                            className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <div className="ml-3">
                                            <div className="font-medium text-gray-900">{point.locationName}</div>
                                            <div className="text-sm text-gray-500">{point.address}</div>
                                            <div className="text-xs text-primary-dark mt-1">Time: {new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </label>
                                ))) : (
                                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                                    <p className="font-bold">❌ No drop-off points available.</p>
                                    <p className="text-sm">This ride cannot be booked because the driver hasn't set any drop-off points.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seat Selection */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seats Required</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                min="1"
                                max={ride.availableSeats}
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                className="block w-24 border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3"
                            />
                            <span className="text-gray-500 text-sm">{ride.availableSeats} seats available</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleBook}
                        disabled={bookingLoading || !canBook}
                        className={`w-full py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white transition-all transform hover:-translate-y-1
                            ${!canBook ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-dark hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark'}
                        `}
                    >
                        {bookingLoading ? 'Processing...' : !canBook ? 'Unavailable' : 'Confirm Booking'}
                    </button>
                    {!canBook && <p className="text-center text-red-500 text-sm mt-2">Cannot book this ride due to missing info or no seats.</p>}
                </div>
            </div>
        </div>
    );
}
