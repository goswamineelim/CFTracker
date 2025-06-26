// store/useHandleStore.js
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from 'react-hot-toast';

const API_URL = "/api/link-handle";
export const useHandleStore = create((set, get) => ({
  handle: null,
  expiry: null, // in ms timestamp
  verificationStarted: false,
  isLinking: false,
  isValidating: false,

  hydrateFromStorage: () => {
    const storedHandle = localStorage.getItem("cf_verification_handle");
    const storedExpiry = parseInt(
      localStorage.getItem("cf_verification_expiry") || "0",
      10
    );
    if (storedHandle && storedExpiry > Date.now()) {
      set({
        handle: storedHandle,
        expiry: storedExpiry,
        verificationStarted: true,
      });
    } else {
      get().clearVerification(); // cleanup if expired or invalid
    }
  },

  timeRemaining: () => {
    const expiry = get().expiry;
    if (!expiry) return 0;
    const remaining = Math.floor((expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  },

  linkHandle: async (handle) => {
    set({ isLinking: true});
    try {
      await axiosInstance.post(`${API_URL}/validateIfExists`, { handle }); 
      await axiosInstance.post(`${API_URL}/link`, { handle });
      const expiry = Date.now() + 2 * 60 * 1000; // 2 minutes
      localStorage.setItem("cf_verification_handle", handle);
      localStorage.setItem("cf_verification_expiry", expiry.toString());
      set({
        handle,
        expiry,
        verificationStarted: true,
      });
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong while linking handle.");
      return false;
    } finally {
      set({ isLinking: false });
    }
  },

  validateHandle: async () => {
    set({ isValidating: true});
    try {
      const res = await axiosInstance.post(`${API_URL}/validate`, {
        handle: get().handle,
      });
      get().clearVerification();
      toast.success("Handle linked");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      set({ isValidating: false });
    }
  },
  disconnectHandle: async () => {
    set({ isValidating: true });
    try {
      await axiosInstance.post(`${API_URL}/disconnect`);
      get().clearVerification();
      toast.success("Handle Disconnected");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      set({ isValidating: false });
    }
  },
  clearVerification: () => {
    localStorage.removeItem("cf_verification_handle");
    localStorage.removeItem("cf_verification_expiry");
    set({
      handle: null,
      expiry: null,
      verificationStarted: false,
    });
  },

  updateCFDetails: async () => {
    try {
      const res = await axiosInstance.post(`${API_URL}/update-cf`, {}, { withCredentials: true });
      useAuthStore.setState({ authUser: res.data });
      toast.success("Details Updated");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
}));
