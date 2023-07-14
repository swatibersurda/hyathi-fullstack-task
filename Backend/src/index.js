const mongoose=require("mongoose")
const express=require("express");
const connect=require("../src/Config/db")
const {register,login}=require("../src/Controller/user.controller")
const app=express();
app.use(express.json())
app.use("/register",register)
app.use("/login",login)
app.listen(5000,async(req,res)=>{
    try{
        await connect()
        console.log("listening on port 5000")
    }catch(err){
        console.log("i am err...")
    }
})
