import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

const API_URL = "http://localhost:5000/api";

export const useAuthStore = create((set, get) => ({
    authUser : null,
    // for adding loading screens later
    isSigningUp: false,
    isLoggingIn : false,
    isUpdatingProfile: false,
    loginG: () => {
        set({isLoggingIn: true});
        window.location.href = `${API_URL}/auth/google`;
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