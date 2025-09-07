import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';

export type Category = {
  _id: string;
  name: string;
};

export const createCategory = async (categoryData: any) => {
    try {
        const response = await axios.post(`${API}/api/category/create`, categoryData);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Category Creation");
    }
};

export const getAllCategory = async () => {
    try {
        const response = await axios.get(`${API}/api/category/all`);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Get all Categories");
    }
};
