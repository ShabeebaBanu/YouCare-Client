import { API } from '../constants/config';
import axios from 'axios';
import { getAccessToken } from '../constants/config';
import { handleApiError } from './ErrorResponse/errorResponse';

export const sendOtp = async (emailData: any) => {
    try {
        const response = await axios.post(`${API}/api/user/otp`, {
            email: emailData
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Send OTP");
    }
};

export const verifyOtp = async (email: any, enteredOtp: any) => {
    try {
        const response = await axios.post(`${API}/api/user/verify/otp`, {
            email: email,
            otp: enteredOtp
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Verify OTP");
    }
};

export const createUser = async (userDate: any) => {
    try {
        const response = await axios.post(`${API}/api/user/create`, userDate);
        console.log("create User response: ", response);
        return response.data;
    } catch (error) {
        handleApiError(error, "User Creation");
    }
};

export const getUserById = async (userId: any) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.get(`${API}/api/user/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    
        return response.data;
    } catch (error) {
        handleApiError(error, "Get User By ID");
    }
};

export const updateUserById = async (userId: any, updatedData: any) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.put(`${API}/api/user/update/${userId}`, 
            updatedData,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data
    } catch (error) {
        handleApiError(error, "Update User");
    }
};

export const resetPassword = async (email: any, newPassword: any) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.put(`${API}/api/user/reset-password/${email}`, 
            newPassword,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data
    } catch (error) {
        handleApiError(error, "Reset Password");
    }
};


