var express = require('express');
var router = express.Router();
const {ObjectId}=require('mongodb')
const {collection} = require('../connection/connect');
const {admincollection} = require('../connection/connect');
var nocache=require('nocache');
var invalida 
var msg

//localhost render
router.get('/admin',nocache(),function(req, res, next) {
  if(req.session.admin)
  {
    res.redirect('/adminHome')
  }
  else{
    res.render('admin',{invalida}); 
    invalida=null;
  } 
});


//admin home render
router.get('/adminHome',nocache(),function(req, res, next) {
  async function finddata(){
   let totable= await collection.find()    
    res.render('adminHome',{totable}); 
  }
  if(req.session.admin) 
  {
    finddata();
  }
  else{
    res.redirect('/admin')
  }
});



//sigin admin
router.post('/signin',(req,res)=>{

  async function checkingadmin(){   
        let admindata ={
          adminname:req.body.adminname,
          adminpassword:req.body.adminpassword
        }
    const adminfind= await admincollection.findOne({adminname:admindata.adminname})
      if(adminfind==null){    
         invalida="invalid name"
         res.redirect('/admin')  
         }else if(adminfind.adminpassword==admindata.adminpassword){   
           req.session.admin=true;
           res.redirect('/adminHome')
         }  
         else if(adminfind.adminpassword!=admindata.adminpassword)
         {
            res.redirect('/admin')
            invalida="invalid password"
         }
  }
  checkingadmin()
  })
  


    //create page render
  router.get('/createuser',(req,res)=>{
    if(req.session.admin) 
    {
    res.render('create',{msg})
    msg=null;
    }
    else
    {
      res.redirect('/admin')
    }
  })
  
  
    //admin user add 
  router.post('/adminuseradd',(req,res,next)=>{
    let data={
       name:req.body.name,
       phonenumber:req.body.phonenumber,
       email:req.body.email,
       password:req.body.password
    }
  async function userexist(){
    user1=await collection.findOne({email:data.email})  
    if(user1){  
       msg="Account Already Exist"   
       res.redirect('/createuser')
    } else{
       collection.insertMany([data])   
       res.redirect('/adminHome')
    } 
  }
  userexist()
  })


  //edit 
  router.get('/edit/:id', async function(req,res){
    let id=req.params.id
   
      const editc=await collection.findOne({_id:id})    
      res.render('edit',{id:editc._id,name:editc.name,phonenumber:editc.phonenumber,email:editc.email,password:editc.password}); 
  })


   //update by admin
   router.post('/update/:id',(req,res,next)=>{
    console.log("iam in update");
     updateid=req.params.id
     collection.updateOne({_id:updateid},{$set:{
      name:req.body.name,
      phonenumber:req.body.phonenumber,
    }}).then(()=>{res.redirect('/adminHome')})
   })



//delete users by admin
router.get('/delete/:id', function(req,res){
  let dlt=req.params.id
  async function deletedata(){
     await collection.deleteOne({_id:new ObjectId(dlt)})    
     res.redirect('/adminHome'); 
   }
   deletedata();  
})


//admin logout
router.get('/adminlogout',function(req, res, next) {
  req.session.admin=false;
  res.redirect('/admin'); 
});



module.exports = router;