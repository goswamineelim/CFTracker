import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';

const API_URL = "http://localhost:5000/api";

export const useTaskStore = create((set, get) => ({
    problems: {},
    isFetching: false,
    isDeleting: false,
    isRefreshing: false,
    refresh: async () => {
        set({ isRefreshing: true });
        try {
            const res = await axiosInstance.post(`${API_URL}/problems/ref`);
            set({ problems: res.data.unsolvedProblems });
            toast.success("Synced Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isRefreshing: false });
        }
    },
    markProblemAsSolved: async ({ problemIndex, contestID, problemState }) => {
        try {
            await axiosInstance.put(`${API_URL}/problems/mark`, {
                problemIndex,
                contestID,
            });
            if (problemState === "solved") problemState = "unsolved";
            else problemState = "solved";
            set((state) => {
                const updatedProblems = state.problems.map((problem) => {
                    const match =
                        problem.problemIndex === problemIndex &&
                        String(problem.contestID) === String(contestID);

                    if (match) {
                        return { ...problem, problemState };
                    }

                    return problem;
                });

                return { problems: updatedProblems };
            });
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {

        }
    },
    deleteProblems: async ({ problemIndex, contestID }) => {
        try {
            await axiosInstance.delete(`${API_URL}/problems/delete`, {
                data: {
                    problemIndex,
                    contestID,
                }
            });

            set((state) => {
                const updatedProblems = state.problems.filter((problem) => {
                    const match =
                        problem.problemIndex === problemIndex &&
                        String(problem.contestID) === String(contestID);
                    return !match; // keep if not a match
                });

                return { problems: updatedProblems };
            });
            toast.success("Problem deleted Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    },
    getProblems: async () => {
        set({ isFetching: true });
        try {
            await axiosInstance.post(`${API_URL}/problems/ref`);
            const res = await axiosInstance.get(`${API_URL}/problems/`);
            console.log(res.data.problems);
            const rows = Array.isArray(res.data.problems) ? res.data.problems : Object.values(res.data.problems);
            set({ problems: rows })
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isFetching: false });
        }
    },
    addProblem: async (link) => {
        set({ isAdding: true });
        try {
            const res = await axiosInstance.post(`${API_URL}/problems/add`, { problemLink: link });
            const addedProblem = res.data.problem;
            if (addedProblem) {
                const current = get().problems;
                set({ problems: [addedProblem, ...current] });
                toast.success("Problem Added Successfully");
            }
        } catch (error) {
            if (error.response?.status === 400) {
                const msg = error.response?.data?.message || "Duplicate or Invalid Problem";
                toast.error(msg);
            } else {
                toast.error("Failed to add problem.");
            }
        } finally {
            set({ isAdding: false });
        }
    }
}))