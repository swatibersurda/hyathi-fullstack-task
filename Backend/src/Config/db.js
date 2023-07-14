const mongoose=require("mongoose");
const connect=()=>{
    return mongoose.connect("mongodb+srv://swatibersurda:1111@cluster0.a28gh0r.mongodb.net/hayathi")
}
module.exports=connect