import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({limit:"10mb",extended:true}))
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}))
app.use(cookieParser());


//Routes
app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)


//make ready for deployment
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}

app.listen(process.env.PORT,()=>{
    console.log(`Server started running on port : ${process.env.PORT}`);
    connectDB();
})