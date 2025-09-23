import {create} from 'zustand';
import {axiosInstance} from "../lib/axios.js"
import {toast} from 'react-hot-toast';

export const useChatStore = create((set,get)=>({
    allContacts : [],
    chats : [],
    messages : [],
    selectedUser : null,
    activeTab : 'chats',
    isUsersLoading : false,
    isMessagesLoading : false,
    isSoundEnabled : JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

    toggleSound: ()=>{
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
        set({isSoundEnabled : !get().isSoundEnabled})
    },

    setActiveTab : (tab)=> set({activeTab : tab}),
    setSelectedUser : (selectedUser)=>set({selectedUser}),

    getAllContacts : async()=>{
        set({isUsersLoading : true})
        try {
            const res = await axiosInstance.get('/message/contacts');
            set({allContacts : res.data})

        } catch (error) {
            toast.error(error.response.data.message)
            console.log(`Error in getAllContacts : ${error}`)
        }finally{
            set({isUsersLoading : false})
        }
    },

    getMyChatPartners : async()=>{
        set({isUsersLoading : true})
        try {
            const res = await axiosInstance.get('/message/chats');
            set({chats : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(`Error in getChatPartners chat store : ${error}`)
        }finally{
            set({isUsersLoading : false})
        }
    }

    
}))