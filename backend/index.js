// const express  = require('express') 
import express from 'express'
import dotenv from "dotenv"
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// routes
import userRouter from './routes/userRoute.js'
import problemRouter from './routes/problemRoute.js'
import contestRouter from './routes/contestRouter.js'
import submissionRouter from "./routes/submissionRouter.js"

dotenv.config({});

const app=express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    // origin: "http://localhost:5173",
    credentials:true  // allows cookies
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/problem', problemRouter);
app.use('/api/v1/contest', contestRouter);
app.use('/api/v1/submission', submissionRouter);

app.get('/', (req,res) => {
    return res.send("Kaam kar raha hai");
});


const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, "0.0.0.0",() => {
            console.log(` Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error(" MongoDB connection failed:", error)
        process.exit(1)
    }
}

startServer()