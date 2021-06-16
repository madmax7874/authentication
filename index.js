const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const brcypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const server = require('./config/db.js');
const User = require('./models/user.js');
const generateToken = require('./utils/generateToken.js')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/signup',(req,res)=>{
    res.render('signup');
});
app.post('/signup',async (req,res)=>{
    console.log(req.body);
    const {firstName, lastName, userName, email, password} = req.body;
    const passwordHash =await brcypt.hash(password,10);
    const user = await User.create({firstName: firstName,lastName: lastName,userName: userName,email: email,password: passwordHash});
    if(user){
        console.log(user)
    }else{
        console.log('no user');
    }
    res.send(req.body); 
});

app.get('/login',(req,res)=>{
    res.render('login');
});
app.post('/login',async (req,res)=>{
    const {email, password} = req.body;
    try {
        await User.findOne({email:email}).then(async (data) => {
            const comparePassword =await brcypt.compare(password,data.password);
            if(comparePassword){
                const token = generateToken(data._id)
                res.cookie('nToken',token,{
                    maxAge:36000000,
                    httpOnly:true
                })
                res.send(token);
            }
            else{
                const error = "Password incorrect";
                res.render('error',{error});
            }
        })
    } catch (e) {
        const error = "Invalid email";
        res.render('error',{error});
    }
    
})

function decodeToken(token){
    const decoded = jwt.verify(token, 'secretkey');
    return decoded.id;
}

app.get('/bye',(req, res) => {  
    console.log(req.cookies.nToken);
    const _id = decodeToken(req.cookies.nToken);
    User.findOne({_id:_id}).then((data)=>{
        res.json(data);
    });
});

app.get('/',(req,res)=>{
    res.render('home');
});

app.listen(3000, function () {
    console.log("Server has started on port 3000");
});
