require('dotenv').config()
const express = require("express");
const app = express();
const path=require('path');
const port = process.env.port||8000;
const hbs=require('hbs');
require("./db/conn");
const register= require("./models/db");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");
const auth= require("../middleware/auth");
const cookieParser= require("cookie-parser");
const { strict } = require('assert');
app.use(cookieParser());





const view_path=path.join(__dirname,"../templates/views");
const partial_path= path.join(__dirname,"../templates/partials");
app.set("view engine", "hbs");
app.set("views",view_path);
hbs.registerPartials(partial_path);
console.log(view_path);

app.get("/", async(req,res)=>{
    res.render("index");

});
app.get("/secret",(req,res)=>{
    
    res.render("secret");

});
app.get("/login",async(req,res)=>{
    res.render("login");
})
app.post("/register",async(req,res)=>{
    try{
        const password= req.body.psw;
        const rpassword= req.body.psw_repeat;
        if(password === rpassword)
        {
            const registerstudent= new register({
                Firstname:req.body.firstname,
                Middlename:req.body.middlename,
                Lasttname:req.body.lastname,
                Course:req.body.cars,
                Gender:req.body.gender,
                Phone:req.body.phone,
                Address:req.body.address,
                email:req.body.email,
                Password:req.body.psw,
                CPassword:req.body.psw_repeat,
                // tokens:jwt.sign({_id:req._id},"mynameisRishiSinghGharwaland imPatnite")
            })

             const token= await registerstudent.generateAutjtoken();
             console.log(token);
             res.cookie("jwts",token);
            //  console.log(cookie);
             
             
             const registered = await registerstudent.save();
             res.status(201).render("index");
        }
        else{
            res.send("password mismatch");
            res.status(201).render("index");
        }
    }catch(e)
    {
        console.log(e);
        res.send(e);
    }
})
app.post("/login",async(req,res)=>{
    try{
        const email= req.body.username;
        const password= req.body.password;
         const namely= await register.findOne({email:email});
        const token= await namely.generateAutjtoken();
         res.cookie("jwt",token,{
             expires: new Date(Date.now()+1000),
             httpOnly:true
          });
          console.log(`${res.cookie.jwt}`);
              console.log(token);
         const ismatch= await bcrypt.compare(password,namely.Password)
        if(ismatch)
         {
             res.status(200).send("successful");
         }
         else
         {
             res.status(400).send("Invalid Credentials");
         }
        //console.log(`${email} + ${password}+ ${namely}`)
    }catch(e){
        res.status(400).send(e)
        console.log(e);
    }
})
app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
});

