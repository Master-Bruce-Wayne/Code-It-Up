import mongoose from "mongoose";

const submissionSchema =new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type:String, required:true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    problemCode: { type:String, required:true },
    
    language: { type: String, required: true },
    code: { type: String, required: true },

    verdict: {
        type: String,
        enum: ["AC", "WA", "TLE", "RE", "CE", "Pending"],
        default: "Pending"
    },

    timeTaken: Number,
    memoryUsed: Number,
}, { timestamps: true });

export const Submission = mongoose.model("Submission", submissionSchema);
