import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

const API_URL = "http://localhost:5000/api";

export const useTaskStore = create((set, get) => ({
    problems: {},
    isFetching: false,
    isDeleting: false,
    isRefreshing: false,
    getProblems : () => {
        set({isFetching:true});
        try {
            const res = axiosInstance.get(`${API_URL}/problems/`);
            console.log(res);
        } catch(error){
            // handle error
        } finally {
            set({isFetching: false});
        }
    },
    addProblem : (link) => {
        set({isAdding: true});
        try{
            const res = axiosInstance.post(`${API_URL}/problems/add`, link);
            if(res.status == 400){
                console.log("Invalid Problem");
            }
        } catch (error){

        } finally{
            set({isAdding : false});
        }
    }
}))