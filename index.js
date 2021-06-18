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
const { postSignup, postLogin, byeRestricted } = require('./controllers/users.js');
require('dotenv').config()

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
app.post('/login', postLogin);
app.get('/bye', byeRestricted);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server has started on port ${PORT}`);
});
