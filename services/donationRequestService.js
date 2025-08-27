import { API } from '../constants/config';
import axios from 'axios';

export const createDonationRequest = async (donationRequestData) => {
    try {
        const response = await axios.post(`${API}/api/request/create`, donationRequestData);
        return response.data;
    } catch (error) {
        console.error("Donation Request Creation Failed:", error.response?.data || error);
        throw error;
    }
};

export const getAllDonationRequest = async () => {
    try {
        const response = await axios.get(`${API}/api/request/all`);
        return response.data.donationRequest;
    } catch (error) {
        console.error("Fetching all Donation Request Failed:", error.response?.data || error);
        throw error;
    }
};

export const getDonationRequestByCreatedBy = async (createdBy) => {
    try {
        const response = await axios.get(`${API}/api/request/createdBy/${createdBy}`);
        return response.data.donationRequest;
    } catch (error) {
        console.log("Fetching Donation Request with createdBy Failed:". error.response?.data || error);
        throw error;
    }
};

export const getDonationRequestByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API}/api/request/user/${userId}`);
        return response.data.donationRequest;
    } catch (error) {
        console.log("Fetching Donation Request with userId Failed:". error.response?.data || error);
        throw error;
    }
}

export const getAllDonationRequestForAUser = async (userId) => {
    try {
        const response = await axios.get(`${API}/api/request/all-request/user/${userId}`);
        return response.data.donationRequest;
    } catch (error) {
        console.log("Fetching Donation Request with userId Failed:". error.response?.data || error);
        throw error;
    }
}

