import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async(req,res)=> {
    try {
        const {username,email,password,confirmPassword} = req.body;
        if(!username || !email || !password || !confirmPassword) {
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        if(password !== confirmPassword){
            return res.status(400).json({success:false, message:"Password do not match"});
        }

        // Check if username already exists
        const { data: existingUser, error: findError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (findError) {
            return res.status(500).json({success:false, message: findError.message});
        }
        if(existingUser) {
            return res.status(400).json({success:false, message:"Username already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
                username, 
                email, 
                password: hashedPassword
            }]);

        if (insertError) {
            return res.status(500).json({success:false, message: insertError.message});
        }

        return res.status(201).json({
            message:"Account created successfully.",
            success:true
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false, message: err.message});
    }
};

export const login = async(req,res) => {
    try{
        const {username,password} = req.body;
        if(!username || !password) {
            return res.status(400).json({success:false, message:"All fields are required"});
        };

        // Query profiles table
        const { data: user, error: findError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .maybeSingle();

        if (findError) {
            return res.status(500).json({success:false, message: findError.message});
        }
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
            userId:user.id
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn:'1d'});

        return res.status(200).cookie("token", token, {
            maxAge:1*24*60*60*1000, httpOnly:true, sameSite:'strict'
        }).json({
            success:true,
            _id:user.id,
            username:user.username,
            fullName:user.full_name,
            email:user.email,
            profilePhoto:user.profile_photo,
            affiliation:user.affiliation
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false, message: err.message});
    }
}

export const updateProfileInfo = async(req,res) =>{
    try{
        const {username, fullName,profilePhoto, affiliation} = req.body;
        if(!username) {
            return res.status(400).json({success:false, message:"Username is required"});
        }

        const { data: user, error: findError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (findError || !user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                full_name: fullName, 
                profile_photo: profilePhoto, 
                affiliation: affiliation
            })
            .eq('username', username);

        if (updateError) {
            return res.status(500).json({success:false, message: updateError.message});
        }

        return res.status(200).json({
            success:true,
            message: "Profile updated successfully"
        })

    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false, message: err.message});
    }
}

export const logout = async(req,res) => {
    try {
        return res.status(200).cookie("token","", {maxAge:0}).json({
            success:true,
            message:"Logged out successfully!"
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false, message: err.message});
    }
}

export const getAllUsers = async(req,res) => {
    try {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to return users"
            });
        }

        // Map database fields to frontend fields
        const mappedUsers = users.map(u => ({
            _id: u.id,
            username: u.username,
            fullName: u.full_name,
            email: u.email,
            profilePhoto: u.profile_photo,
            affiliation: u.affiliation,
            current_rating: u.current_rating,
            max_rating: u.max_rating
        }));

        return res.status(200).json({
            success:true,
            message:"Users fetched",
            users: mappedUsers
        })
    } catch(err) {
        return res.status(500).json({
            success:false,
            message: err.message
        })
    }
}