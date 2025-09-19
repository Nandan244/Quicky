import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandler.js';
import cloudinary from '../lib/cloudinary.js';


const signup =async (req, res) => {
    const {fullName , email , password } = req.body;
    try {
        //check all fields are given
        if(!fullName || !email || !password){
           return res.status(400).json({message:"All fields are required"});
        }
        //check password length
        if(password.length < 6){
           return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        //check email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
           return res.status(400).json({message:"Please enter a valid email"});
        }
        //check if user already exists
        const userExists = await User.findOne({email})
        if(userExists){
           return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create user
        const newUser = new User({
            fullName,
            email,
            password : hashedPassword
        });

        if(newUser){
            //generate token
            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);
            
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
                createdAt : newUser.createdAt,
                updatedAt : newUser.updatedAt
            })

            try {
                await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL);
            } catch (error) {
                console.log(`Failed to send welcome email: ${error.message}`);
            }
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }

    } catch (error) {
        console.log(`Error in Signup Controller : ${error.message}`);
        return res.status(500).json({message:"Server Error"});
    }
}

const login =async (req, res) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    try {
        const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid Credentials"});
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credentials"});
    }
    generateToken(user._id,res);
    return res.status(200).json({
        _id : user._id,
        fullName : user.fullName,   
        email : user.email,
        profilePic : user.profilePic,
        createdAt : user.createdAt,
        updatedAt : user.updatedAt
    });
    } catch (error) {
        console.log(`Error in Login Controller : ${error.message}`);
        return res.status(500).json({message:"Server Error"});
    }
}

const logout = (req, res) => {
    res.cookie('jwt','',{maxAge : 0})
    res.status(200).json({message:"Logged out successfully"});
}

const updateProfile = async (req,res)=>{

    const {profilePic} = req.body;
    try {
        if(!profilePic){ return res.status(400).json({message:"Profile picture is required"}) }

        const user_id = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        if(!uploadResponse){ return res.status(500).json({message:"Failed to upload image"}) }
        const updatedUser = await User.findByIdAndUpdate(user_id,{profilePic:uploadResponse.secure_url},{new:true}).select('-password');

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(`Error in update profile controller: ${error.message}`);
        res.status(500).json({message:"Internal Server Error"});
    }

}

export  { signup, login, logout , updateProfile };