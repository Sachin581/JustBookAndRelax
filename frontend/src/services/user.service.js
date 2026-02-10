import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8081/api/users';

const getProfile = async () => {
    const user = authService.getCurrentUser();
    const token = user ? user.token : '';
    const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export default {
    getProfile
};
