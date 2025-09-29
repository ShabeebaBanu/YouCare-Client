import { API } from '../constants/config';
import axios from 'axios';
import { getAccessToken, getAuthHeaders } from '../constants/config';
import { handleApiError } from './ErrorResponse/errorResponse';

export type Need = {
  _id: string;
  title: string;
  item?: string;
  description?: string;
  status?: string;
  quantity?: number;
  category?: {
    _id: string;
    name: string;
  };
  image?: string;
  needyName?: string;
  needyPhone?: string;
  delivaryAddress?: string;
  district?: {
    _id: string;
    name: string;
    province: string;
  };
  likes?: number;
  views?: number;
  userType?: string;
  delivary?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createNeed = async (needData: any) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.post(`${API}/api/need/create`, needData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Need Creation");
    }
};

export const getAllNeed = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/need/all`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get All Needs");
    }
};

export const getNeedByNeedId = async (needId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/need/${needId}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Need By ID");
    }
};

export const getNeedByCreatedBy = async (createdBy: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/need/createdBy/${createdBy}`, headers);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get Need By CreatedBy");
    }
};

export const filterNeed = async (filterData: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API}/api/need/filter/create`, filterData, headers);
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        handleApiError(error, "Filter Need");
    }
};

export const getNearByNeeeds = async (userId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API}/api/need/nearby/user/${userId}`, headers);
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        handleApiError(error, "Get NearBy Needs");
    }
};

export const updateNeed = async (needId: any, updatedNeed: any) => {
    try {
        console.log("updated date :", updatedNeed);
        const response = await axios.put(`${API}/api/need/${needId}`, updatedNeed, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        handleApiError(error, "Update need");
    }
};


export const deleteNeed = async (needId: any) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.delete(`${API}/api/need/${needId}`, headers);
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        handleApiError(error, "Deletw Need");
    }
}
