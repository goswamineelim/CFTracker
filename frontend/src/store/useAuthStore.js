import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

const API_URL = "http://localhost:5000/api";

export const useAuthStore = create((set, get) => ({
    authUser : null,
    // for adding loading screens later
    isSigningUp: false,
    isLoggingIn : false,
    isUpdatingProfile: false,
    isValidating: false,
    loginGoogle: () => {
        set({isLoggingIn: true});
        window.location.href = `${API_URL}/auth/google`;
    },
    signup: async (data) => {
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post(`${API_URL}/auth/signup`, data);
            return res.data;
        } catch(error){
            console.error("Signup error ", error);
        } finally {
            set({isSigningUp: false});
        }
    },
    validate: async ({ username, password, otp, email }) => {
        set({isValidating: true});
        try {
          const res = await axiosInstance.post(`${API_URL}/auth/verify`, {
            username,
            password,
            otp,
            email,
          });
      
          // Set user on successful validation
          set({ authUser: res.data.user });
          return res.data;
        } catch (error) {
            console.error("Validation error", error);
        } finally {            
            set({isValidating: false})
        }
    },
    login: async (data) => {
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post(`${API_URL}/auth/login`, data);
            return res.data;
        } catch(error){
            console.error("Signup error ", error);
        } finally {
            set({isLoggingIn: false});
        }
    },
    logout: async () => {
        try{
            await axiosInstance.post(`${API_URL}/auth/logout`);
            set({authUser : null});
        } catch(error){
            console.error("Logout error ", error);
        }
    },
    getUser: async () => {
        try{
            const res = await axiosInstance.get(`${API_URL}/auth/me`, {withCredentials: true})
            set({authUser: res.data});
        } catch(error){
            set({authUser: null});
        } finally {
            set({isLoggingIn: false});
            set({isSigningUp: false});
        }
    }
}))