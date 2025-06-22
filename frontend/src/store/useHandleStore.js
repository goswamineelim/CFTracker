// store/useHandleStore.js
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

const API_URL = "http://localhost:5000/api/link-handle";
export const useHandleStore = create((set, get) => ({
  handle: null,
  expiry: null, // in ms timestamp
  verificationStarted: false,
  isLinking: false,
  isValidating: false,
  error: null,

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
    set({ isLinking: true, error: null });
    try {
      const res = await axiosInstance.post(`${API_URL}/link`, { handle });
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
      set({ error: error?.response?.data?.message || "Error linking handle" });
      return false;
    } finally {
      set({ isLinking: false });
    }
  },

  validateHandle: async () => {
    set({ isValidating: true, error: null });
    try {
      const res = await axiosInstance.post(`${API_URL}/validate`, {
        handle: get().handle,
      });
      console.log(res);
      get().clearVerification();
      return true;
    } catch (error) {
      console.log(error);
      set({
        error: error?.response?.data?.message || "Error validating handle",
      });
      return false;
    } finally {
      set({ isValidating: false });
    }
  },
  disconnectHandle: async () => {
    set({ isValidating: true, error: null });
    try {
      await axiosInstance.post(`${API_URL}/disconnect`);
      get().clearVerification();
      return true;
    } catch (error) {
      console.error(error);
      set({
        error: error?.response?.data?.message || "Error disconnecting handle",
      });
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
      error: null,
    });
  },
}));
