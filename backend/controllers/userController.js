import { User } from "../models/userModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async(req,res)=> {
    try {
        const {username,email,password,confirmPassword} = req.body;
        // console.log("req body: ",req.body);
        if(!username || !email || !password || !confirmPassword) {
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        if(password !== confirmPassword){
            return res.status(400).json({success:false, message:"Password do not match"});
        }

        const user = await User.findOne({username});
        if(user) {
            return res.status(400).json({success:false, message:"Username already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username, email, password:hashedPassword
        });
        return res.status(201).json({
            message:"Account created successfully.",
            success:true
        })
    } catch(err) {
        console.log(err);
    }
};

export const login = async(req,res) => {
    try{
        const {username,password} = req.body;
        // console.log("req body: ",req.body);
        if(!username || !password) {
            return res.status(400).json({success:false, message:"All fields are required"});
        };

        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({
                message:"Incorrect username or password",
                success:false
            })
        };

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                message:"Incorrect username or password",
                success:false
            })
        };
        const tokenData={
            userId:user._id
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn:'1d'});

        return res.status(200).cookie("token", token, {
            maxAge:1*24*60*60*1000, httpOnly:true, sameSite:'strict'
        }).json({
            success:true,
            _id:user._id,
            username:user.username,
            fullName:user.fullName,
            email:user.email,
            profilePhoto:user.profilePhoto,
            affiliation:user.affiliation
        });

    } catch(err) {
        console.log(err);
    }
}

// export const updateProfileInfo = async(req,res) =>{
//     try{
//         const {username, fullName,profilePhoto, affiliation} = req.body;
//         if(!username) {
//             return res.status(400).json({success:false, message:"Username return karde backend me saath me"});
//         }

//         const user = await User.findOne({username});
//         if(!user) {
//             return res.status(400).json({
//                 message:"Incorrect username or password",
//                 success:false
//             })
//         };

//     } catch(err) {
//         console.log(err);
//     }
// }

export const logout = async(req,res) => {
    try {
        return res.status(200).cookie("token","", {maxAge:0}).json({
            success:true,
            message:"Logged out successfully!"
        })
    } catch(err) {
        console.log(err);
    }
}