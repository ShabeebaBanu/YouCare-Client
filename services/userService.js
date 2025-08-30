import { API } from '../constants/config';
import axios from 'axios';
import { getAccessToken } from '../constants/config';

export const sendOtp = async (emailData) => {
    try {
        const response = await axios.post(`${API}/api/user/otp`, {
            email: emailData
        });
        console.log("send otp response: ", response);
        return response.data;
    } catch (error) {
        console.error("OTP Sent Failed:", error.response?.data || error);
        throw error;
    }
};

export const verifyOtp = async (email, enteredOtp) => {
    try {
        const response = await axios.post(`${API}/api/user/verify/otp`, {
            email: email,
            otp: enteredOtp
        });
        console.log("verify otp response: ", response);
        return response.data;
    } catch (error) {
        console.error("Verifying OTP Failed:", error.response?.data || error);
        throw error;
    }
};

export const createUser = async (userDate) => {
    try {
        const response = await axios.post(`${API}/api/user/create`, userDate);
        console.log("create User response: ", response);
        return response.data;
    } catch (error) {
        console.error("User creation Failed:", error.response?.data || error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.get(`${API}/api/user/${userId}`, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Fetching User Details Failed:", error.response?.data || error);
        throw error;
    }
};

export const updateUserById = async (userId, updatedData) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.put(`${API}/api/user/update/${userId}`, 
            updatedData,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        console.log("User update response: ", response);
        return response.data
    } catch (error) {
        console.error("updating User Details Failed:", error.response?.data || error);
        throw error;
    }
};

export const resetPassword = async (email, newPassword) => {
    try {
        const token = await getAccessToken(); 
        const response = await axios.put(`${API}/api/user/reset-password/${email}`, 
            newPassword,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        console.log("password reset response: ", response);
        return response.data
    } catch (error) {
        console.error("Password reseting Failed:", error.response?.data || error);
        throw error;
    }
};


