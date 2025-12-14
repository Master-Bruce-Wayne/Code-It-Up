import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    fullName: {   type:String, default:"" },
    username: {  type:String, required:true, unique:true  },
    email: {   type:String, required:true, unique:true  },
    password: {  type:String, required:true  },
    profilePhoto: {  type:String, default:""  },
    affiliation : {  type:String, default:""  },
    current_rating: {  type: Number, default:0  },
    max_rating: {  type:Number, dafault: 0  }
}, {timestamps: true });

export const User=mongoose.model("User", userModel);