import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';
import { getAuthHeaders } from '../constants/config';

export const createApproveNeed = async (approveNeedData: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/approve/create`, approveNeedData, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Need Approval Creation");
    }
};

export const getAllApproveNeeds = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/all`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Need Approvals");
    }
};

export const getApproveNeedByCreatedBy = async (createdBy: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/createdBy/${createdBy}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve Need By CreatedBy");
    }
};

export const getApproveNeedByUserId = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/user/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve Need By User");
    }
};

export const getApproveNeedDetailsByApproveNeedId = async (approveNeedId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/detail/${approveNeedId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve need details By id");
    }
}

export const getApproveNeedDetailsByNeedId = async (needId: any, userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/detail/need/${needId}/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get need details By id");
    }
}


export const getApproveNeedByNeedId = async (needId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/detail/${needId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve Need By Need ID");
    }
}

// export const confirmDonation = async (donationRequestId: any) => {
//     try {
//         const response = await axios.put(`${API}/api/request/confirm/${donationRequestId}`);
//         return response.data;
//     } catch (error) {
//         handleApiError(error, "Confirm Donation");
//     }
// }

export const rejectApproval = async (approveNeedId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API}/api/approve/reject/${approveNeedId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Reject Need Approval");
    }
}

export const getAllApproveNeedForAUser = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/approve/all-approval/user/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Need Approvals of a User");
    }
}

export const deleteApproveNeed = async (approveNeedId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.delete(`${API}/api/approve/${approveNeedId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Delete Need Approval");
    }
}


