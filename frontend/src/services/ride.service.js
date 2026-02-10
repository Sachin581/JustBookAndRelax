import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8081/api/rides';

const createRide = async (rideData) => {
    const user = authService.getCurrentUser();
    const token = user ? user.token : '';
    const response = await axios.post(API_URL, rideData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const getMyOffers = async () => {
    const user = authService.getCurrentUser();
    const token = user ? user.token : '';
    const response = await axios.get(`${API_URL}/my-offers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const searchRides = async (origin, destination) => {
    // No auth header needed for search
    const response = await axios.get(`${API_URL}/search`, {
        params: { origin, destination }
    });
    return response.data;
};

export default {
    createRide,
    getMyOffers,
    searchRides
};
