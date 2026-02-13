import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rideService from '../services/ride.service';
import LocationInput from '../components/LocationInput';

export default function OfferRide() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        dateTime: '',
        pricePerSeat: '',
        totalSeats: 1,
        pickupPoints: [],
        dropPoints: []
    });
    const [loading, setLoading] = useState(false);
    const [availableCities, setAvailableCities] = useState([]);

    // Temporary state for new point inputs
    const [newPickup, setNewPickup] = useState({ locationName: '', address: '', time: '' });
    const [newDrop, setNewDrop] = useState({ locationName: '', address: '', time: '' });

    useEffect(() => {
        // Mock cities or fetch from API if needed
        setAvailableCities(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addPickupPoint = () => {
        if (newPickup.locationName && newPickup.address && newPickup.time) {
            setFormData(prev => ({
                ...prev,
                pickupPoints: [...prev.pickupPoints, newPickup]
            }));
            setNewPickup({ locationName: '', address: '', time: '' });
        } else {
            alert("Please fill all fields for Pickup Point");
        }
    };

    const removePickupPoint = (index) => {
        setFormData(prev => ({
            ...prev,
            pickupPoints: prev.pickupPoints.filter((_, i) => i !== index)
        }));
    };

    const addDropPoint = () => {
        if (newDrop.locationName && newDrop.address && newDrop.time) {
            setFormData(prev => ({
                ...prev,
                dropPoints: [...prev.dropPoints, newDrop]
            }));
            setNewDrop({ locationName: '', address: '', time: '' });
        } else {
            alert("Please fill all fields for Drop Point");
        }
    };

    const removeDropPoint = (index) => {
        setFormData(prev => ({
            ...prev,
            dropPoints: prev.dropPoints.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formatDateTime = (dateStr) => {
                if (!dateStr) return null;
                return dateStr.length === 16 ? `${dateStr}:00` : dateStr;
            };

            // Check if there are pending points
            if ((newPickup.locationName || newPickup.address) && !confirm("You have entered a Pickup Point but not added it. Ignore and publish?")) {
                setLoading(false);
                return;
            }
            if ((newDrop.locationName || newDrop.address) && !confirm("You have entered a Drop Point but not added it. Ignore and publish?")) {
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                dateTime: formatDateTime(formData.dateTime),
                pickupPoints: formData.pickupPoints.map(p => ({
                    ...p,
                    time: formatDateTime(p.time)
                })),
                dropPoints: formData.dropPoints.map(p => ({
                    ...p,
                    time: formatDateTime(p.time)
                }))
            };

            await rideService.createRide(payload);
            alert("Ride published successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create ride", error);
            alert("Failed to publish ride. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light min-h-screen font-sans text-gray-900 pb-12">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-primary via-[#6D2822] to-secondary pb-24 pt-12 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl font-extrabold tracking-tight">Offer a Ride</h1>
                    <p className="mt-4 text-xl text-red-50 opacity-90 max-w-2xl mx-auto">
                        Share your journey, save costs, and meet new people.
                    </p>
                </div>
            </div>

            <div className="-mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Card 1: Route Details */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">1. Route Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LocationInput
                                placeholder="Leaving from (Source)"
                                value={formData.source}
                                onChange={(val) => setFormData(prev => ({ ...prev, source: val }))}
                                icon="⚪"
                                options={availableCities}
                            />
                            <LocationInput
                                placeholder="Going to (Destination)"
                                value={formData.destination}
                                onChange={(val) => setFormData(prev => ({ ...prev, destination: val }))}
                                icon="⚫"
                                options={availableCities}
                            />
                        </div>
                    </div>

                    {/* Card 2: Schedule & Price */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">2. Schedule & Price</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="dateTime"
                                    required
                                    className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-gray-50 hover:bg-white transition-colors"
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                                <input
                                    type="number"
                                    name="totalSeats"
                                    min="1"
                                    max="8"
                                    required
                                    className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white"
                                    value={formData.totalSeats}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Seat ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="pricePerSeat"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="block w-full pl-8 border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary py-3 px-4 bg-white"
                                        placeholder="0.00"
                                        value={formData.pricePerSeat}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Pickup Points */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">3. Pickup Points</h3>
                            <span className="text-xs text-primary bg-red-50 px-2 py-1 rounded-full font-medium">{formData.pickupPoints.length} added</span>
                        </div>
                        <div className="p-6 space-y-4">
                            {formData.pickupPoints.map((point, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div>
                                        <p className="font-bold text-gray-900">{point.locationName}</p>
                                        <p className="text-sm text-gray-600">{point.address}</p>
                                        <p className="text-xs text-primary mt-1">🕒 {new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <button type="button" onClick={() => removePickupPoint(index)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            ))}

                            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 pt-2">
                                <div className="md:col-span-2">
                                    <input placeholder="Location Name" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none" value={newPickup.locationName} onChange={e => setNewPickup({ ...newPickup, locationName: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <input placeholder="Address" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none" value={newPickup.address} onChange={e => setNewPickup({ ...newPickup, address: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <input type="datetime-local" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none" value={newPickup.time} onChange={e => setNewPickup({ ...newPickup, time: e.target.value })} />
                                </div>
                                <button type="button" onClick={addPickupPoint} className="md:col-span-1 bg-secondary text-white font-bold rounded-xl hover:bg-primary transition-colors flex items-center justify-center shadow-md">
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Drop Points */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">4. Drop Points</h3>
                            <span className="text-xs text-primary bg-red-50 px-2 py-1 rounded-full font-medium">{formData.dropPoints.length} added</span>
                        </div>
                        <div className="p-6 space-y-4">
                            {formData.dropPoints.map((point, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div>
                                        <p className="font-bold text-gray-900">{point.locationName}</p>
                                        <p className="text-sm text-gray-600">{point.address}</p>
                                        <p className="text-xs text-primary mt-1">🕒 {new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <button type="button" onClick={() => removeDropPoint(index)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            ))}

                            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 pt-2">
                                <div className="md:col-span-2">
                                    <input placeholder="Location Name" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none" value={newDrop.locationName} onChange={e => setNewDrop({ ...newDrop, locationName: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <input placeholder="Address" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none" value={newDrop.address} onChange={e => setNewDrop({ ...newDrop, address: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <input type="datetime-local" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none" value={newDrop.time} onChange={e => setNewDrop({ ...newDrop, time: e.target.value })} />
                                </div>
                                <button type="button" onClick={addDropPoint} className="md:col-span-1 bg-secondary text-white font-bold rounded-xl hover:bg-primary transition-colors flex items-center justify-center shadow-md">
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 btn-premium text-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Publishing...' : 'Publish Ride'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
