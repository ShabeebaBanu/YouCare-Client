import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';

export const getUnreadNotificationCountByUserId = async (userId: any) => {
    try {
        const response = await axios.get(`${API}/api/notification/unread/${userId}`);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "Get All unread notification count");
    }
};

export const updateUnreadWishlistAsRead = async (userId: any) => {
    try {
        const response = await axios.post(`${API}/api/notification/mark-read/wishlist/${userId}`);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "update unread wishlist to read");
    }
};

export const updateUnreadRequestAsRead = async (userId: any) => {
    try {
        const response = await axios.post(`${API}/api/notification/mark-read/request/${userId}`);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "update unread request to read");
    }
};