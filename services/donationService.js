import { API } from '../constants/config';
import axios from 'axios';
import { getAccessToken } from '../constants/config';

export const createDonation = async (donationData) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.post(`${API}/api/donation/create`, donationData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
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
        console.log("Fetching Donation Failed:". error.response?.data || error);
        throw error;
    }
};

export const getDonationByCreatedBy = async (createdBy) => {
    try {
        const response = await axios.get(`${API}/api/donation/createdBy/${createdBy}`);
        return response.data;
    } catch (error) {
        console.log("Fetching Donation Failed:". error.response?.data || error);
        throw error;
    }
};

export const filterDonation = async (filterData) => {
    try {
        const response = await axios.post(`${API}/api/donation/filter/create`, filterData);
        console.log("response: ", response);
        return response.data.donations;
    } catch (error) {
        console.log("Filtering Donations Failed:". error.response?.data || error);
        throw error;
    }
};

export const getNearByDonations = async (userId) => {
    try {
        const response = await axios.get(`${API}/api/donation/nearby/user/${userId}`);
        console.log("response: ", response);
        return response.data.data;
    } catch (error) {
        console.log("fetching nearby Donations Failed:". error.response?.data || error);
        throw error;
    }
};

export const updateDonation = async (donationId, updatedDonation) => {
    try {
        const response = await axios.put(`${API}/api/donation/${donationId}`, updatedDonation, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        console.log("updating Donation Failed:". error.response?.data || error);
        throw error;
    }
};

export const deleteDonation = async (donationId) => {
    try {
        const response = await axios.delete(`${API}/api/donation/${donationId}`);
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        console.log("deleting Donation Failed:". error.response?.data || error);
        throw error;
    }
}

