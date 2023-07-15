const express=require("express");
const userModel=require("../Model/user.model")
const app=express();
const bcryptjs=require("bcryptjs");
const jsonWebToken=require("jsonwebtoken")
require("dotenv").config()

const register=async(req,res)=>{
    // first find if user is not already register.
    const existingUser=await userModel.findOne({email:req.body.email}).lean().exec();
    if(existingUser){
        return res.status(500).json({message:"user is already register go login..."})
    }
    // hash password and store then whole user.
    // providing salt along it.
   const hashPassword=bcryptjs.hashSync(req.body.password,10)
   try{
    const data=new userModel({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword,
        adoptionArray:[]

    })
    await data.save()
    return res.status(201).json({message:"user registred sucessfully...",data})
   }catch(err){
     return res.status(500).json({message:"internal server error"})
   }
}
const login=async(req,res)=>{
    // need to check if user is registred otherwise he/she can not login.
    const existingUser=await userModel.findOne({email:req.body.email}).lean().exec();
    if(!existingUser){
        return res.status(500).json({message:"user is not registred login first"})
    }
    // comapare password.
    const checkPassword=bcryptjs.compareSync(req.body.password,existingUser.password)
    // means credentials enter are wrongg....
    if(!checkPassword){
        return res.status(401).json({message:"email or password wrong enter correct credentials.."})
    }
    try{
        const token=jsonWebToken.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:"14hrs"})
        return res.status(201).json({message:"loggedin sucessfully",user:existingUser,token})
    }catch(err){
        return res.status(500).json({message:"internal server error..."})
    }
}

const getAllUser=async(req,res)=>{
    try{
        const data=await userModel.find().lean().exec();
        return res.status(200).json({message:"geted all data",data})
    }catch(err){
        return res.status(500).json({meassage:"internal server error..."})
    }
}
// this for geting indivisual user so that can show all adopted pokemon on feeding page.
const getUserById=async(req,res)=>{
    try{
        console.log(req.params.id)
        const data=await userModel.findById(req.params.id).populate("adoptionArray");
        return res.status(200).json({message:"geted all data",data})
    }catch(err){
        return res.status(500).json({meassage:"internal server error..."})
    }
}


module.exports={register,login,getAllUser,getUserById}