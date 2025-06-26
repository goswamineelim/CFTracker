import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const API_URL = "/api";

export const useAuthStore = create((set, get) => ({
    authUser : null,
    // for adding loading screens later
    isSigningUp: false,
    isLoggingIn : false,
    isUpdatingProfile: false,
    isValidating: false,
    loginGoogle: () => {
        window.location.href = `${API_URL}/auth/google`;
    },
    signup: async (data) => {
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post(`${API_URL}/auth/signup`, data);
            return true;
        } catch(error){
            toast.error(error?.response?.data?.message);
            return false;
        } finally {
            set({isSigningUp: false});
        }
    },
    resendOTP: async (email) => {
        set({ isResending: true }); // optional loading flag in store
        try {
            const res = await axiosInstance.post(`${API_URL}/auth/resend`, { email });
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message);
            return false;
        } finally {
            set({ isResending: false });
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
          toast.success("Validation complete");
          // Set user on successful validation
          set({ authUser: res.data });
          return true;
        } catch (error) {
            toast.error(error?.response?.data?.message);
            return false;
        } finally {            
            set({isValidating: false})
        }
    },
    login: async (data) => {
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post(`${API_URL}/auth/login`, data);
            set({authUser:res.data})
            toast.success("Logged in successfully");
            return true;
        } catch(error){
            toast.error(error?.response?.data?.message);
            return false;
        } finally {
            set({isLoggingIn: false});
        }
    },
    logout: async () => {
        try{
            await axiosInstance.post(`${API_URL}/auth/logout`);
            set({authUser : null});
            toast.success("Logged out successfully");
            return true;
        } catch(error){
            toast.error(error?.response?.data?.message);
            return false;
        }
    },
    getUser: async () => {
        try{
            const res = await axiosInstance.get(`${API_URL}/auth/me`, {withCredentials: true})
            set({authUser: res.data});
        } catch(error){
            set({authUser: null});
            // toast.error(error?.response?.data?.message);
        } finally {
            set({isLoggingIn: false});
            set({isSigningUp: false});
        }
    }
}))