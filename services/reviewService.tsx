import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';

export const createReview = async (reviewData: any) => {
    try {
        const response = await axios.post(`${API}/api/review/create`, reviewData);
        return response.data;
    } catch (error) {
        handleApiError(error, "review Creation");
    }
};

export const getReviewByCreatedByAndPostId = async (createdBy: any, postId : any) => {
    try {
        const response = await axios.get(`${API}/api/review/${postId}/${createdBy}`);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Review by CreatedBy and PostId");
    }
};

export const updateReview = async (reviewId: any, updatedReview: any) => {
    try {
        const response = await axios.put(`${API}/api/review/${reviewId}`, updatedReview);
        return response.data;
    } catch (error) {
        handleApiError(error, "Update Review");
    }
}

