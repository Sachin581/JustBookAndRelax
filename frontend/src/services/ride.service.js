import api from './api';

const API_URL = '/api/rides';

const createRide = async (rideData) => {
    const response = await api.post(API_URL, rideData);
    return response.data;
};

const getMyOffers = async () => {
    const response = await api.get(`${API_URL}/my-offers`);
    return response.data;
};

const searchRides = async (source, destination) => {
    // No auth header needed for search but api instance handles it if present
    const response = await api.get(`${API_URL}/search`, {
        params: { source, destination }
    });
    return response.data;
};

const getRideById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

const getActiveRoutes = async () => {
    const response = await api.get('/api/routes/active');
    return response.data;
};

export default {
    createRide,
    getMyOffers,
    searchRides,
    getRideById,
    getActiveRoutes
};
