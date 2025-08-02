import axios from "axios";
import { setAccessToken, clearAccessToken, config } from '../constants/config';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from "jwt-decode";

const CLIENT_ID = config.KEYCLOAK_CLIENT;
const CLIENT_SECRET = config.KEYCLOAK_CLIENT_SECRET;
const KEYCLOAK_URL = config.KEYCLOAK_URL;

const TOKEN_KEY = "access_token";

export const loginWithKeycloak = async (username, password) => {
    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("username", username);
    data.append("password", password);

    try {
        const response = await axios.post(KEYCLOAK_URL, data.toString(), 
            {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return response;
    } catch (error) {
        console.error("Login Failed : ", error.response?.data || error);
        throw error;
    }
}


export const saveToken = async (token) => {
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        const decoded = jwtDecode(token);
        
        setAccessToken(token, decoded.sub);
        return token;
    } catch (error) {
        console.log("Failed to save :", error.message)
        alert('Failed to save token:', error);
    }
}


export const loadToken = async () => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY); // await it
        if (token) {
            const decoded = jwtDecode(token);
            LOGGEDIN_USER_ID = decoded.sub;

            setAccessToken(token, LOGGEDIN_USER_ID);
            return token;
        } else {
            alert('Please login');
            return null;
        }
    } catch (error) {
        alert('Failed to load token:', error.message);
        return null;
    }
}


export const clearToken = async () => {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        clearAccessToken();
    } catch (error) {
        alert('Failed to clear token:', error);
    }
}
