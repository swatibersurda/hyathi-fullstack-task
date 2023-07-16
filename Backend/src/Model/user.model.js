const mongoose = require("mongoose");
const userSchema=new mongoose.Schema({
    // first making register and authentication.
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    // making this so that when a user adopt a pokemon so that it can go inside adoptionlist.
    // 1-m relationship
    adoptionArray:[
      {
       healthStatus:{type:Number,default:1}, 
       pokemon:{type:mongoose.Types.ObjectId,ref:"pokemon",required:true}
      }
        
    ]
},{
    versionkey:false, 
    timestamps:true
})
// this schema is applicable for user collection
module.exports=new mongoose.model("user",userSchema)