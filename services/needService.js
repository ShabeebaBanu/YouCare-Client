import { API } from '../constants/config';
import axios from 'axios';
import { getAccessToken } from '../constants/config';

export const createNeed = async (needData) => {
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
        console.error("Need Creation Failed:", error.response?.data || error);
        throw error;
    }
};

export const getAllNeed = async () => {
    try {
        const response = await axios.get(`${API}/api/need/all`);
        return response.data.needs;
    } catch (error) {
        console.error("Fetching all Needs Failed:", error.response?.data || error);
        throw error;
    }
};

export const getNeedByNeedId = async (needId) => {
    try {
        const response = await axios.get(`${API}/api/need/${needId}`);
        return response.data.need;
    } catch (error) {
        console.log("Fetching Need with ID Failed:". error.response?.data || error);
        throw error;
    }
};

export const getNeedByCreatedBy = async (createdBy) => {
    try {
        const response = await axios.get(`${API}/api/need/createdBy/${createdBy}`);
        return response.data;
    } catch (error) {
        console.log("Fetching Need with createdBy Failed:". error.response?.data || error);
        throw error;
    }
};

export const filterNeed = async (filterData) => {
    try {
        const response = await axios.post(`${API}/api/need/filter/create`, filterData);
        console.log("response: ", response);
        return response.data.needs;
    } catch (error) {
        console.log("Filtering Need with ID Failed:". error.response?.data || error);
        throw error;
    }
};

export const getNearByNeeeds = async (userId) => {
    try {
        const response = await axios.get(`${API}/api/need/nearby/user/${userId}`);
        console.log("response: ", response);
        return response.data.data;
    } catch (error) {
        console.log("fetching nearby Needs Failed:". error.response?.data || error);
        throw error;
    }
};

export const updateNeed = async (needId, updatedNeed) => {
    try {
        const response = await axios.put(`${API}/api/need/${needId}`, updatedNeed, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        console.log("updating Need Failed:". error.response?.data || error);
        throw error;
    }
};


export const deleteNeed = async (needId) => {
    try {
        const response = await axios.delete(`${API}/api/need/${needId}`);
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        console.log("deleting Need Failed:". error.response?.data || error);
        throw error;
    }
}
