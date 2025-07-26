import axios from "axios";
import { config } from '../constants/config';

const CLIENT_ID = config.KEYCLOAK_CLIENT;
const CLIENT_SECRET = config.KEYCLOAK_CLIENT_SECRET;
const KEYCLOAK_URL = config.KEYCLOAK_URL;

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
        return response.data;
    } catch (error) {
        console.error("Login Failed : ", error.response?.data || error);
        throw error;
    }
}

