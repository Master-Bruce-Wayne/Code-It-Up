import mongoose from 'mongoose';

const contestModel = new mongoose.Schema({
    contestName: { type:String, required:true },
    contestCode: {  type: String, required:true},
    startTime: {  type:Date, required:true  },
    duration: { type:Number, required:true },
    rated: { type:Boolean, default: true },

    problems: [{
        problemId: { type:mongoose.Schema.Types.ObjectId, ref: "Problem"},
        index:String,
    }],

    setters: [{ type: mongoose.Schema.Types.ObjectId,  ref:"User" }],
    testers: [{ type: mongoose.Schema.Types.ObjectId,  ref:"User" }],
})

export const Contest = mongoose.model("Contest", contestModel);