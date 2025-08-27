import { API } from '../constants/config';
import axios from 'axios';

export const createNeed = async (needData) => {
    try {
        const response = await axios.post(`${API}/api/need/create`, needData, {
            headers: {
                "Content-Type": "multipart/form-data",
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
}
