import API from '../constants/config';
import axios from 'axios';

export const createDonation = async (donationData) => {
    try {
        const response = await axios.post(`${API}/api/donation/create`, donationData);
        return response.data;
    } catch (error) {
        console.error("Donation Creation Failed:", error.response?.data || error);
        throw error;
    }
};
