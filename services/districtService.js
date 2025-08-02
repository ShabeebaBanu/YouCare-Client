import { API } from '../constants/config';
import axios from 'axios';
import { USER_ID } from '../constants/config';

export const getAllDistrict = async () => {
    try {
        const response = await axios.get(`${API}/api/district/all`);
        console.log(response.data.districts);
        console.log(USER_ID);
        return response.data.districts;
    } catch (error) {
        console.error("Fetching all Distrcits Failed:", error.response?.data || error);
        throw error;
    }
};
