const mongoose = require("mongoose");
mongoose.set('strictQuery',false);
mongoose.connect("mongodb://127.0.0.1:27017/loginData", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    phonenumber:{type:String,required:true},
    email:{type:String,required:true},  
    password:{type:String,required:true}
   });

   const adminSchema = new mongoose.Schema({
    adminname:{type:String,required:true},
    adminpassword:{type:String,required:true}
   });

   const collection =new mongoose.model("userdatas", userSchema);
   const admincollection =new mongoose.model("admindatas", adminSchema);

   module.exports={collection:collection,admincollection:admincollection};
