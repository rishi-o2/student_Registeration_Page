require('dotenv').config();
const express= require("express");
const mongoose= require("mongoose");
const validator= require("validator");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");

const subjschema= new mongoose.Schema({
    Firstname:{
        type:String,
         required:true,
        trim:true
    },
    Middlename:{
        type:String,
         required:true,
        trim:true
    },
    Lasttname:{
        type:String,
         required:true,
        trim:true
    },
    Course:{
        type:String,
         required:true,
        trim:true
    },
    Gender:{
        type:String,
         required:true,
        trim:true
    },
    Phone:{
        type:String,
         required:true,
        unique:true,
        min:10,
        
    },
    Address:{
        type:String,
         required:true,
        trim:true,
        max:100,
    },
   
    email:{
        type:String,
         required:true,
        unique:[true,"Email already used"],
        validate(value)
        {
          if(!validator.isEmail(value))
          {
              throw new Error("Invalid email");
          }

        }
      },
      Password:{
        type:String,
         required:true
      },
     CPassword:{
        type:String,
         required:true
      },
      tokens:[{
        token:{
            type:String,
            // required:true,
        }
      }]
       
})

 subjschema.methods.generateAutjtoken = async function(){

     try{
         const token= jwt.sign({_id:this._id}, process.env.SECRET_KEY);
         console.log(token);
         this.tokens= this.tokens.concat({token:token});
         await this.save();
         return token;
         



     }catch(e){
         console.log(e);

     }

 }

subjschema.pre("save",async function(next){
    if(this.isModified("Password")){
        // console.log(`the current password is ${this.Password}`);
    this.Password= await bcrypt.hash(this.Password,10);
    // console.log(`the hashed password is ${passwordHash}`);
    this.CPassword=  await bcrypt.hash(this.CPassword,10);
    
    }
    next();
    
})

const register= new mongoose.model("Register",subjschema);
module.exports= register;
