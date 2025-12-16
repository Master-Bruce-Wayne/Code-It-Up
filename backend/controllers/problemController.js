import {Problem } from "../models/problemModel";
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
            !tags ||
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
        console.log(err);
    }
}