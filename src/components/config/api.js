import axios from "axios";

//export const API_URL = `https://foodorder-server-production.up.railway.app`;
export const API_URL = `http://localhost:8080`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
