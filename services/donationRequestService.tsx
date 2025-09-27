import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';

export const createDonationRequest = async (donationRequestData: any) => {
    try {
        const response = await axios.post(`${API}/api/request/create`, donationRequestData);
        return response.data;
    } catch (error) {
        handleApiError(error, "Donation Request Creation");
    }
};

export const getAllDonationRequest = async () => {
    try {
        const response = await axios.get(`${API}/api/request/all`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Donation Request");
    }
};

export const getDonationRequestByCreatedBy = async (createdBy: any) => {
    try {
        const response = await axios.get(`${API}/api/request/createdBy/${createdBy}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By CreatedBy");
    }
};

export const getDonationRequestByUserId = async (userId: any) => {
    try {
        const response = await axios.get(`${API}/api/request/user/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By User");
    }
};

export const getDonationRequestDetailsByDonationRequestId = async (donationRequestId: any) => {
    try {
        const response = await axios.get(`${API}/api/request/detail/${donationRequestId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By Donation");
    }
}

export const getDonationRequestByDonationId = async (donationId: any) => {
    try {
        const response = await axios.get(`${API}/api/request/donation/${donationId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By Donation");
    }
}

export const confirmDonation = async (donationRequestId: any) => {
    try {
        const response = await axios.put(`${API}/api/request/confirm/${donationRequestId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Confirm Donation");
    }
}

export const rejectDonation = async (donationRequestId: any) => {
    try {
        const response = await axios.put(`${API}/api/request/reject/${donationRequestId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Reject Donation");
    }
}

export const getAllDonationRequestForAUser = async (userId: any) => {
    try {
        const response = await axios.get(`${API}/api/request/all-request/user/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Donation Request of a User");
    }
}

export const deleteDonationRequest = async (donationRequestId: any) => {
    try {
        const response = await axios.delete(`${API}/api/request/${donationRequestId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Delete Donation Request");
    }
}


