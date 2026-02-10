import axios from 'axios';

const API_URL = 'http://localhost:8081/api/content';

const getQuotes = async () => {
    try {
        const response = await axios.get(`${API_URL}/quotes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    }
};

const getSocialLinks = async () => {
    try {
        const response = await axios.get(`${API_URL}/social-links`);
        return response.data;
    } catch (error) {
        console.error("Error fetching social links:", error);
        return [];
    }
};

export default {
    getQuotes,
    getSocialLinks
};
