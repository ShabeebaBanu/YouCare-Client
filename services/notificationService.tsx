import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';
import { getAuthHeaders } from '../constants/config';

export const getUnreadNotificationCountByUserId = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/notification/unread/${userId}`, headers);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "Get All unread notification count");
    }
};

export const updateUnreadWishlistAsRead = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/notification/mark-read/wishlist/${userId}`, headers);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "update unread wishlist to read");
    }
};

export const updateUnreadRequestAsRead = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/notification/mark-read/request/${userId}`, headers);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "update unread request to read");
    }
};

export const getDonationRequestAndNeedApprovalForAUser = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/notification/all/user/${userId}`, headers);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "Get All DonationRequest and Need Approval For a Given User");
    }
};