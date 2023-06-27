const jwt= require("jsonwebtoken");
 const register= require("../src/models/db");
 const cookieParser = require("cookie-parser");
 const express= require("express");
 const app = express();

 app.use(cookieParser());

 const auth = async(req,res,next) =>{
    try{
        const token= req.cookies.jwt;
        const verifyuser =jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyuser);
        next();
        

    } catch(e)
    {
        console.log(e);
    }
 }
 module.exports= auth;