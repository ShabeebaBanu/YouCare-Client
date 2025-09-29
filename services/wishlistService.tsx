import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';
import { getAuthHeaders } from '../constants/config';

export const createWishList = async (wishlistData: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/wishlist/create`, wishlistData, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Wishlist Creation");
    }
};

export const getAllWishlist = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/wishlist/all`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Wishlists");
    }
};

export const getWishlistByCreatedBy = async (createdBy: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/wishlist/createdBy/${createdBy}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Wishlist By CreatedBy");
    }
};

export const getWishlistByUserId = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/wishlist/user/${userId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Wishlist By User");
    }
};

export const deleteWishlistById = async (wishlistId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.delete(`${API}/api/wishlist/${wishlistId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Delete Wishlist");
    }
}

