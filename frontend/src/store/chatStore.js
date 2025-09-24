import {create} from 'zustand';
import {axiosInstance} from "../lib/axios.js"
import {toast} from 'react-hot-toast';
import {useAuthStore} from "./authStore.js"

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
    },
    getMessagesByUserId : async (userId)=>{
        set({isMessagesLoading : true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages : res.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log(`Error in getting messages use chat store : ${error}`)
            
        }finally{
            set({isMessagesLoading : false})
        }
    },
    sendMessage : async(messageData)=>{
        const {selectedUser , messages} = get()
        const {authUser} = useAuthStore.getState()

        const tempId = `temp-${Date.now()}`
        const optimisticMessage = {
            _id: tempId,
            senderId : authUser._id,
            recieverId : selectedUser._id,
            text : messageData.text,
            image : messageData.image,
            createdAt : new Date().toISOString(),
            isOptimistic : true, //flag to identify optimistic message
        }
        set({messages : [...messages,optimisticMessage]})
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData)
            set({messages : messages.concat(res.data)})
        } catch (error) {
            set({messages : messages})
            toast.error(error?.response?.data?.message || "Something went wrong");
            
        }
    },

    
}))