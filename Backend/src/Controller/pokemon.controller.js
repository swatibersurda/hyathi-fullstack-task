const express=require("express");
const pokeMonRouter=express.Router();
const pokeMonModel=require("../Model/pokemon.model")
const userModel=require("../Model/user.model");
const pokemonModel = require("../Model/pokemon.model");
pokeMonRouter.get("/",async(req,res)=>{
  try{
    const data=await pokeMonModel.find().lean().exec();
    return res.status(200).json({pokemons:data})
  }catch(err){
    return res.status(500).json({message:"internal server error"})
  }
})
// this posting so that can add pokemon to the user who has adopted or inside adoptionArray
pokeMonRouter.post("/",async(req,res)=>{
    // first we will find the user
    let existingUser;
    try{
        existingUser=await userModel.findById(req.body.user_id)
        //  console.log(existingUser,"existinguserr")
      

    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"user not found"});
       }
       try{
        const pokemon={
            _id:req.body._id,
            bread:req.body.bread,
            age: req.body.age,
            healthStatus:req.body.healthStatus,
            image:req.body.image
           }
        existingUser.adoptionArray.push(pokemon);
       
      }catch(err){
        return console.log(err);
      }
         return res.status(201).json(blogs)

})
module.exports=pokeMonRouter