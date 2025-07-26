import { API } from '../constants/config';
import axios from 'axios';

export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API}/api/category/create`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Category Creation Failed:", error.response?.data || error);
        throw error;
    }
};

export const getAllCategory = async () => {
    try {
        const response = await axios.get(`${API}/api/category/all`);
        return response.data.categories;
    } catch (error) {
        console.error("Fetching all Categories Failed:", error.response?.data || error);
        throw error;
    }
};
