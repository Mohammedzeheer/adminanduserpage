var express = require('express');
var router = express.Router();
const {collection} = require('../connection/connect');
var promise=require('promise')
var nocache=require('nocache');
var msg
var msg1
var invalid
var username

router.get('/', nocache(),function(req, res, next) {
   if(req.session.user){
      res.redirect('/home')
   }
   else
   {
      res.render('users',{msg,msg1,invalid})
      msg=null;
      msg1=null;
      invalid=null;
   }   
});

router.get('/home',nocache(), function(req, res, next) {
 if( req.session.user) {
   res.render('home',{username})
 }
 else
 {
   res.redirect('/')
 }
});



router.post('/login',(req,res)=>{   

    async function checking(){
      
    let userdata ={
      email:req.body.email,
      password:req.body.password
    }
 
    const userfind= await collection.findOne({email:userdata.email})
      if(userfind==null){    
      invalid="invalid email"
      res.redirect('/')  
    }else if(userfind.password==userdata.password){  
          req.session.user=userfind.email 
         //  req.session.user=true;
             username=userfind.name
            res.redirect('/home')
         }  
         else if(userfind.password!=userdata.password)
         {
            res.redirect('/')
            invalid="invalid password"
         }
}
checking()
})


router.post('/register',(req,res,next)=>{

   let data={
      name:req.body.name,
      phonenumber:req.body.phonenumber,
      email:req.body.email,
      password:req.body.password
   }

 async function userexist(){
   user1=await collection.findOne({email:data.email})  
   if(user1){  
      msg="Account Already Exist Please login"   
      console.log(msg)
      res.redirect('/')
   } else{
      collection.insertMany([data])
      req.session.user=data.email
      username=data.name
      res.redirect('/home')
   } 
 }
 userexist()
})



router.get('/logout', function(req, res, next) {
   // req.session.user="";
   req.session.user=null;
   res.redirect('/')
});

module.exports = router;
