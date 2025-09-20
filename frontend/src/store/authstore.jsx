import { create } from "zustand";

export const useAuthStore = create((set) =>({
    user : {name : "John Doe", age : 25},
    isLoading : false,
    isLoggedIn : false,

    login : ()=>{
        set({isLoggedIn : true});
    }
}))