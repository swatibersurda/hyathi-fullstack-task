const mongoose = require("mongoose");
const userSchema=new mongoose.Schema({
    // first making register and authentication.
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
},{
    versionkey:false, 
    timestamps:true
})
// this schema is applicable for user collection
module.exports=new mongoose.model("user",userSchema)