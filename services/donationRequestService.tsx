import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';
import { getAuthHeaders } from '../constants/config';

export const createDonationRequest = async (donationRequestData: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/request/create`, donationRequestData, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Donation Request Creation");
    }
};

export const getAllDonationRequest = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/all`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Donation Request");
    }
};

export const getDonationRequestByCreatedBy = async (createdBy: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/createdBy/${createdBy}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By CreatedBy");
    }
};

export const getDonationRequestByUserId = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/user/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By User");
    }
};

export const getDonationRequestDetailsByDonationRequestId = async (donationRequestId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/detail/${donationRequestId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By Donation");
    }
}

export const getDonationRequestByDonationId = async (donationId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/donation/${donationId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By Donation");
    }
}

export const getAllDonationRequestByDonationId = async (donationId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/all-request/donation/${donationId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Donation Request By Donation");
    }
}

export const confirmDonation = async (donationRequestId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API}/api/request/confirm/${donationRequestId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Confirm Donation");
    }
}

export const rejectDonation = async (donationRequestId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API}/api/request/reject/${donationRequestId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Reject Donation");
    }
}

export const getAllDonationRequestForAUser = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/request/all-request/user/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Donation Request of a User");
    }
}

export const deleteDonationRequest = async (donationRequestId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.delete(`${API}/api/request/${donationRequestId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Delete Donation Request");
    }
}


