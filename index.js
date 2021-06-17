const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const brcypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const server = require('./config/db.js');
const User = require('./models/user.js');
const generateToken = require('./utils/generateToken.js');
const { log } = require('console');
const { postSignup } = require('./controllers/users.js');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/signup',(req,res)=>{
    try {
        res.render('signup');
    } catch (error) {
        res.sendStatus(403);
    }
});
app.post('/signup', postSignup);

app.get('/login',(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        res.sendStatus(403);
    }
});
app.post('/login',async (req,res)=>{
    const {email, password} = req.body;
    try {
        await User.findOne({email:email}).then(async (data) => {
            const comparePassword =await brcypt.compare(password,data.password);
            if(comparePassword){
                const token = generateToken(data._id)
                res.cookie('nToken',token,{maxAge:36000000,httpOnly:true})
                res.redirect('/bye');
            }
            else{
                const error = "Password incorrect";
                res.render('error',{error});
            }
        })
    }catch (e) {
        const error = "Invalid email";
        res.render('error',{error});
    }  
})

app.get('/bye',(req, res) => {  
    try {
        const decoded = jwt.verify(req.cookies.nToken, 'secretkey');
        User.findOne({_id:decoded.id}).then((data)=>{
            res.render('bye',{data});
        });
    } catch (e) {
        const error = "Please Login first";
        res.render('error',{error});
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
  });

app.get('/',(req,res)=>{
    try {
        res.render('home');
    } catch (error) {
        res.sendStatus(403);
    }
});

app.get('*',(req,res)=>{
    res.sendStatus(404);
})

app.listen(3000, function () {
    console.log("Server has started on port 3000");
});
