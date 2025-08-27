import { API } from '../constants/config';
import axios from 'axios';

export const createDonation = async (donationData) => {
    try {
        const response = await axios.post(`${API}/api/donation/create`, donationData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    } catch (error) {
        console.error("Donation Creation Failed:", error.response?.data || error);
        throw error;
    }
};

export const getAllDonation = async () => {
    try {
        const response = await axios.get(`${API}/api/donation/all`);
        return response.data.donations;
    } catch (error) {
        console.error("Fetching all Donations Failed:", error.response?.data || error);
        throw error;
    }
};

export const getDonationByDonationId = async (donationId) => {
    try {
        const response = await axios.get(`${API}/api/donation/${donationId}`);
        return response.data.donation;
    } catch (error) {
        console.log("Fetching Donation with ID Failed:". error.response?.data || error);
        throw error;
    }
}

