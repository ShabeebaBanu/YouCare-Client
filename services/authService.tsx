import axios from "axios";
import { setAccessToken, clearAccessToken, config } from '../constants/config';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { Platform } from 'react-native';
import { handleApiError } from "./ErrorResponse/errorResponse";

const CLIENT_ID = config.KEYCLOAK_CLIENT;
const CLIENT_SECRET = config.KEYCLOAK_CLIENT_SECRET;
const KEYCLOAK_URL = config.KEYCLOAK_URL;

const TOKEN_KEY = "access_token";

export const loginWithKeycloak = async (username: any, password: any) => {
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
        handleApiError(error, "User Creation");
    }
}

export const saveToken = async (token: any) => {
    try {
        if (Platform.OS === 'web') {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
     
        const decoded = jwtDecode(token);
        setAccessToken(token, decoded.sub);

        return token;
    } catch (error) {
        handleApiError(error, "Save Token");
    }
}

export const loadToken = async () => {
    try {
        let token;

        if (Platform.OS === 'web') {
            token = localStorage.getItem(TOKEN_KEY);
        } else {
            token = await SecureStore.getItemAsync(TOKEN_KEY);
        }

        if (token) {
            const decoded = jwtDecode(token);
            setAccessToken(token, decoded.sub);
            
            return token;
        } else {
            alert('Please login');
            return null;
        }
    } catch (error) {
        handleApiError(error, "Load Token");
    }
}

export const clearToken = async () => {
    try {
        if (Platform.OS === 'web') {
            localStorage.removeItem(TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
        clearAccessToken();
    } catch (error) {
        handleApiError(error, "Clear token");
    }
}
