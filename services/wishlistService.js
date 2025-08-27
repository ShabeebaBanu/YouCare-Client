import { API } from '../constants/config';
import axios from 'axios';

export const createWishList = async (wishlistData) => {
    try {
        const response = await axios.post(`${API}/api/wishlist/create`, wishlistData);
        return response.data;
    } catch (error) {
        console.error("Wishlist Creation Failed:", error.response?.data || error);
        throw error;
    }
};

export const getAllWishlist = async () => {
    try {
        const response = await axios.get(`${API}/api/wishlist/all`);
        return response.data.wishlist;
    } catch (error) {
        console.error("Fetching all Wishlist Failed:", error.response?.data || error);
        throw error;
    }
};

export const getWishlistByCreatedBy = async (createdBy) => {
    try {
        const response = await axios.get(`${API}/api/wishlist/createdBy/${createdBy}`);
        return response.data.wishlist;
    } catch (error) {
        console.log("Fetching Wishlist with createdBy Failed:". error.response?.data || error);
        throw error;
    }
};

export const getWishlistByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API}/api/wishlist/user/${userId}`);
        return response.data.wishList;
    } catch (error) {
        console.log("Fetching Wishlist with userId Failed:". error.response?.data || error);
        throw error;
    }
};

export const deleteWishlistById = async (wishlistId) => {
    try {
        const response = await axios.delete(`${API}/api/wishlist/${wishlistId}`);
        return response.data;
    } catch (error) {
        console.log("Deleting Wishlist with wishlistId Failed:". error.response?.data || error);
        throw error;
    }
}

