import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const API_URL = "http://localhost:5000/api";

export const useTaskStore = create((set, get) => ({
    problems: {},
    isFetching: false,
    isDeleting: false,
    isRefreshing: false,
    refresh : async () => {
        set({isRefreshing : true});
        try{
            await axiosInstance.get(`${API_URL}/problems/ref`);
        } catch(error){

        } finally{
            set({isRefreshing : false});
        }
    },
    getProblems: async () => {
        set({ isFetching: true });
        try {
            await axiosInstance.get(`${API_URL}/problems/ref`);
            const res = await axiosInstance.get(`${API_URL}/problems/`);
            console.log(res.data.problems);
            const rows = Array.isArray(res.data.problems) ? res.data.problems : Object.values(res.data.problems);
            set({ problems: rows })
            console.log(rows);
        } catch (error) {
            // handle error
        } finally {
            set({ isFetching: false });
        }
    },
    addProblem: async (link) => {
        set({ isAdding: true });
        try {
            const res = await axiosInstance.post(`${API_URL}/problems/add`, { problemLink: link });
            if (res.status == 400) {
                console.log("Invalid Problem");
            }
            const addedProblem = res.data.problem;
            if (addedProblem) {
                const current = get().problems;
                set({ problems: [addedProblem, ...current] });
            }
        } catch (error) {

        } finally {
            set({ isAdding: false });
        }
    }
}))