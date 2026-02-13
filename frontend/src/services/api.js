
import axios from 'axios';
import authService from './auth.service';

const api = axios.create({
    baseURL: 'http://localhost:8081',
});

api.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
