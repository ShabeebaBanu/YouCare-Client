import { API } from '../constants/config';
import axios from 'axios';
import { handleApiError } from './ErrorResponse/errorResponse';

export type District = {
  _id: string;
  name: string;
  province: string;
};

export const getAllDistrict = async () => {
    try {
        const response = await axios.get(`${API}/api/district/all`);
        return response.data;
    } catch (error:any) {
        handleApiError(error, "Get All Districts");
    }
};
