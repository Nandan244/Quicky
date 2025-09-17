import express from 'express';
import dotenv from 'dotenv';


import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config();

const app = express();


app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server started running on port : ${process.env.PORT}`);
})