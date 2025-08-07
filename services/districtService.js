import { API } from '../constants/config';
import axios from 'axios';

export const getAllDistrict = async () => {
    try {
        const response = await axios.get(`${API}/api/district/all`);
        return response.data.districts;
    } catch (error) {
        console.error("Fetching all Distrcits Failed:", error.response?.data || error);
        throw error;
    }
};
