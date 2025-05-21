// require('dotenv').config() there is no issue, but it's not recommended to use it in the code
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})
connectDB()





/*
import express from "express";
const app = express();
;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error to connect to MongoDB ",error)
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error connecting to MongoDB ", error);
        throw error;
    }
})()
// first approch to connect db to mern  */ 