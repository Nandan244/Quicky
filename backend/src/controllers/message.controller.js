import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";



export const getContacts =  async(req, res) => {
    try {
        // console.log(req.user)
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id : {$ne : loggedInUserId}}).select('-password');
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error in get contacts controller : ${error}`);
        res.status(500).json({message : "Internal server error"});
    }
}

export const getMessagesByUserId = async(req, res) => {
    try {
        const myId = req.user._id;
        const {id:recieverId} = req.params;

        const messages = await Message.find({
            $or : [
                {senderId:myId,recieverId:recieverId},
                {senderId:recieverId,recieverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error in get messages by user id controller : ${error}`);
        res.status(500).json({message : "Internal server error"});
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const senderId = req.user._id;
        const {id:recieverId} = req.params;

        const { text , image} = req.body;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            const imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image : imageUrl
        })

        await newMessage.save();

        //todo : real time message sending using socket.io

        res.status(200).json(newMessage);
    } catch (error) {
        console.log(`Error in send message controller : ${error}`);
        res.status(500).json({message : "Internal server error"});
    }
}

export const getChatPartners = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId : loggedInUserId},
                {recieverId : loggedInUserId}
            ]
        })

        const chatPartnersId =[ ...new Set(messages.map(msg=> msg.senderId.toString() === loggedInUserId.toString() 
        ? msg.recieverId.toString() 
        : msg.senderId.toString()))]

        const chatPartners = await User.find({_id : {$in : chatPartnersId}}).select('-password');

        res.status(200).json(chatPartners)
    } catch (error) {
        console.log(`Error in get chat partners controller : ${error}`);
        res.status(500).json({message : "Internal server error"});
    }
}