import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const {MONGO_URI} = process.env;
        if(!MONGO_URI) throw new Error("MONGO_URI is not defined in env variables");
        
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error occured : ${error.message}`);
        process.exit(1);
        
    }
}