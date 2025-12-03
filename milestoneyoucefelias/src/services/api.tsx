import axios from "axios";
const BASE = "https://milestone1-ogfx.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: false,
});

export async function apiGet(path: string) {
    try {
        const response = await axiosInstance.get(path);
        return response.data; // JavaScript object from API
    } catch (error) {
        console.error("GET request failed:", error);
        throw error; // re-throw so React can handle it
    }
}
export async function apiPost(path: string, data?: any) {
    try {
        const response = await axiosInstance.post(path, data);
        return response.data;
    } catch (error) {
        console.error("POST request failed:", error);
        throw error;
    }
}
export async function apiPut(path: string, data?: any) {
    try {
        const response = await axiosInstance.put(path, data);
        return response.data;
    } catch (error) {
        console.error("PUT request failed:", error);
        throw error;
    }
}
export async function apiDelete(path: string) {
    try {
        const response = await axiosInstance.delete(path);
        return response.data;
    } catch (error) {
        console.error("DELETE request failed:", error);
        throw error;
    }
}