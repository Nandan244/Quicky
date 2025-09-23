import express from "express"

import {signup,login,logout,updateProfile} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

// router.get('/test',arcjetProtection,(req,res)=>{
//     res.status(200).json({message:"Arcjet is working fine"})
// })


router.use(arcjetProtection) //applying arcject protection to all auth routes

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.put('/update-profile',protectRoute,updateProfile)

router.get('/check',protectRoute,(req,res)=>{
    console.log("Request recieved")
    res.status(200).json(req.user)})

export default router;