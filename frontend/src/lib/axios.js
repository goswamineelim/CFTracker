import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "/api",
  withCredentials: true,
});