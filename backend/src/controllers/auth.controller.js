import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';


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
            generateToken(newUser._id,res);
            
           return res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
                createdAt : newUser.createdAt,
                updatedAt : newUser.updatedAt
            })
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }

    } catch (error) {
        console.log(`Error in Signup Controller : ${error.message}`);
        return res.status(500).json({message:"Server Error"});
    }
}

const login = (req, res) => {
    res.send("Signup route");
}

const logout = (req, res) => {
    res.send("Signup route");
}

export  { signup, login, logout };