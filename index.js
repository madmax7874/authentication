const express = require('express');
const path = require('path');
const app = express();

const mongoose = require('mongoose');
const server = require('./config/db.js');
const User = require('./models/user.js');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.post('/',async (req,res)=>{
    console.log(req.body);
    res.send(req.body); 
    const {firstName, lastName, userName, email, password} = req.body;
    const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password
    });    
    if(user){
        console.log(user)
    }else{
        console.log('no user');
    }  
});

app.get('/',(req,res)=>{
    res.render('form');
});

app.listen(3000, function () {
    console.log("Server has started on port 3000");
});