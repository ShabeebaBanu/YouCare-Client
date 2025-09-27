import { API } from '../constants/config';
import axios from 'axios';
import { getAccessToken } from '../constants/config';
import { handleApiError } from './ErrorResponse/errorResponse';

export type Donation = {
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
  image?:string;
  donerName?: string;
  donerPhone?: string;
  pickupAddress?: string;
  district?: {
    _id: string;
    name: string;
    province: string;
  };
  likes?: number;
  views?: number;
  userType: string;
  delivary?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};


export const createDonation = async (donationData: any) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.post(`${API}/api/donation/create`, donationData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Donation Creation");
    }
};

export const getAllDonation = async () => {
    try {
        const response = await axios.get(`${API}/api/donation/all`);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Get All donations");
    }
};

export const getDonationByDonationId = async (donationId: any) => {
    try {
        const response = await axios.get(`${API}/api/donation/${donationId}`);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Get Donation By ID");
    }
};

export const getDonationByCreatedBy = async (createdBy: any) => {
    try {
        const response = await axios.get(`${API}/api/donation/createdBy/${createdBy}`);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Get Donation By CreatedBy");
    }
};

export const filterDonation = async (filterData: any) => {
    try {
        const response = await axios.post(`${API}/api/donation/filter/create`, filterData);
        console.log("response: ", response);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Filter donation");
    }
};

export const getNearByDonations = async (userId: any) => {
    try {
        const response = await axios.get(`${API}/api/donation/nearby/user/${userId}`);
        console.log("response: ", response);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Get NearBy Donations");
    }
};

export const updateDonation = async (donationId: any, updatedDonation: any) => {
    try {
        const response = await axios.put(`${API}/api/donation/${donationId}`, updatedDonation, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("response: ", response);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Update Donation");
    }
};

export const deleteDonation = async (donationId: any) => {
    try {
        const response = await axios.delete(`${API}/api/donation/${donationId}`);
        console.log("response: ", response);
        return response.data;
    } catch (error: any) {
        handleApiError(error, "Delete Donation");
    }
}

