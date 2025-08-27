import { API } from '../constants/config';
import axios from 'axios';

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


