const mongoose = require("mongoose");
const pokeMonSchema=new mongoose.Schema({
    bread:{type:String,required:true},
    age:{type:Number,required:true},
    healthStatus:{type:Number,required:true},
    image:{type:String,required:true}
},{
    versionkey:false,
    timestamps:true
})
module.exports=new mongoose.model("pokemon",pokeMonSchema)