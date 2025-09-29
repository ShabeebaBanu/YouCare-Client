import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';
import { getAuthHeaders } from '../constants/config';

export const createUserFeedback = async (feedbackData: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/feedback/create`, feedbackData, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Feedback Creation");
    }
};

export const getAllFeedback = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/feedback/all`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Feedback");
    }
};

export const getFeedbackByCreatedBy = async (createdBy: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/feedback/createdBy/${createdBy}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Feedbacks By CreatedBy");
    }
};

export const getFeedbackByUserId = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/feedback/user/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Feedbacks By User");
    }
};

export const deleteFeedbackById = async (feedbackId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.delete(`${API}/api/feedback/${feedbackId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Delete Feedback");
    }
}

