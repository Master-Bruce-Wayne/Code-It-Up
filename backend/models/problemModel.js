import mongoose from 'mongoose';

const sampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true }
  },
  { _id: false }
);

const problemModel = new mongoose.Schema({
    probName:{  type:String, required: true, unique: true },
    probCode: {  type:String, required:true, unique:true },
    timeLimit: { type:Number, required:true, default: 2000  },
    memoryLimit: { type:Number, required:true , default: 512 },    
    probTags:{ type: [String], index:true },

    probStatement: { type:String, required: true },
    inputFormat: { type:String, required:true },
    outputFormat: { type:String, required:true  },
    constraints: { type:String, required:true },
    probRating: { type:Number, required:true  },
    
    samples: [sampleSchema],

    // testCaseFolder: {
    //     type:String, 
    //     required:true
    // }
},{timestamps:true });

export const Problem =mongoose.model("Problem", problemModel);