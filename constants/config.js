//Keycloak Config
export const config = {
  KEYCLOAK_CLIENT: 'YouCare-Dev',
  KEYCLOAK_URL: 'http://localhost:8080/realms/YouCare/protocol/openid-connect/token',
  KEYCLOAK_CLIENT_SECRET: 'LPTLBVHg9jsETfgFrUG0X0ubUMmGsWNA',
};

export const API = 'http://localhost:8000'

//Manage Auth Token
let ACCESS_TOKEN = null;
let USER_ID = null;

export const setAccessToken = (token, userId) => {
  ACCESS_TOKEN = token;
  USER_ID = userId;
};

export const getAccessToken = () => ACCESS_TOKEN;

export const getUserId = () => USER_ID;

export const clearAccessToken = () => {
  ACCESS_TOKEN = null;
  USER_ID = null;
};

