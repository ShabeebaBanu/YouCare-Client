import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';

export const createApproveNeed = async (approveNeedData: any) => {
    try {
        const response = await axios.post(`${API}/api/approve/create`, approveNeedData);
        return response.data;
    } catch (error) {
        handleApiError(error, "Need Approval Creation");
    }
};

export const getAllApproveNeeds = async () => {
    try {
        const response = await axios.get(`${API}/api/approve/all`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Need Approvals");
    }
};

export const getApproveNeedByCreatedBy = async (createdBy: any) => {
    try {
        const response = await axios.get(`${API}/api/approve/createdBy/${createdBy}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve Need By CreatedBy");
    }
};

export const getApproveNeedByUserId = async (userId: any) => {
    try {
        const response = await axios.get(`${API}/api/approve/user/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve Need By User");
    }
};

export const getApproveNeedDetailsByApproveNeedId = async (approveNeedId: any) => {
    try {
        const response = await axios.get(`${API}/api/approve/detail/${approveNeedId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Approve need details By id");
    }
}

export const getApproveNeedDetailsByNeedId = async (needId: any, userId: any) => {
    try {
        const response = await axios.get(`${API}/api/approve/detail/need/${needId}/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get need details By id");
    }
}


export const getApproveNeedByNeedId = async (needId: any) => {
    try {
        const response = await axios.get(`${API}/api/approve/detail/${needId}`);
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
        const response = await axios.put(`${API}/api/approve/reject/${approveNeedId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Reject Need Approval");
    }
}

export const getAllApproveNeedForAUser = async (userId: any) => {
    try {
        const response = await axios.get(`${API}/api/approve/all-approval/user/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Need Approvals of a User");
    }
}

export const deleteApproveNeed = async (approveNeedId: any) => {
    try {
        const response = await axios.delete(`${API}/api/approve/${approveNeedId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Delete Need Approval");
    }
}


