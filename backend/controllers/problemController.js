import {Problem } from "../models/problemModel.js";
import {User} from "../models/userModel.js";
// import mongoose from "mongoose";

export const createProblem = async(req,res) =>{
    try {
        const {
            probName,
            probCode,
            timeLimit,
            memoryLimit,
            probTags,
            probStatement,
            inputFormat,
            outputFormat,
            constraints,
            probRating,
            samples,
            userId
        } = req.body;

        if (
            !probName ||
            !probCode ||
            !probTags ||
            !probStatement ||
            !inputFormat ||
            !outputFormat ||
            !constraints ||
            !probRating ||
            !samples ||
            !userId
        ) {
            return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
            });
        }

        const dupProb= await Problem.findOne({$or: [{ probName }, { probCode }] });

        if(dupProb) {
            return res.status(409).json({
                success: false,
                message: "Problem with same name or code already exists"
            });
        }

        // const user = await User.findOne({username: username});
        // if(!user) {
        //     return res.status(400).json({
        //         success:"false",
        //         message:"User name provided is invalid"
        //     })
        // }
        // const userId=user._id;
        
        const problem = await Problem.create({
            probName,
            probCode,
            timeLimit,
            memoryLimit,
            probTags,
            probStatement,
            inputFormat,
            outputFormat,
            constraints,
            probRating,
            samples,
            createdBy: userId
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem
        });

    } catch(err) {
        // console.log(err);
        res.status(500).json({ success:false, message: err.message });
    }
}

export const getAllProblems = async(req,res) => {
    try {
        const problems = await Problem.find();
        return res.status(200).json({
            success: true,
            message:"Problems fetched successfully",
            problems
        });
    } catch(err) {
        // console.log(err);
        res.status(500).json({ success:false, message: err.message });
    }
}

export const getProblemByCode = async(req,res) => {
    try {
        const {probCode} = req.params;
        if(!probCode)  {
            return res.status(400).json({
                success:false,
                message: "Problem code is not provided"
            })
        }
        
        const problem = await Problem.findOne({probCode});
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem found",
            problem
        });
    } catch(err) {
        // console.log(err);
        res.status(500).json({ sucess:false, message: err.message });
    }
}