const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const brcypt= require('bcrypt');
const server = require('./config/db.js');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

async function securePassword(password){
    const passwordHash= await brcypt.hash(password,10);
    return passwordHash;
}


app.post('/signup',async (req,res)=>{
    console.log(req.body);
    res.send(req.body); 
    const {firstName, lastName, userName, email, password} = req.body;
    const passwordHash =await securePassword(password);
    const user = await User.create({firstName: firstName,lastName: lastName,userName: userName,email: email,password: passwordHash});
    if(user){
        console.log(user)
    }else{
        console.log('no user');
    }  
});
app.get('/signup',(req,res)=>{
    res.render('signup');
});
// app.post('/signup',async (req,res)=>{
//     console.log(req.body);
//     res.send(req.body); 
//     const {firstName, lastName, userName, email, password} = req.body;
//     const user = new User({
//         firstName: firstName,
//         lastName: lastName,
//         userName: userName,
//         email: email,
//         password: password
//     });    
//     User.schema.pre("save",async function(next){
//         console.log(this.password);
//         this.password= brcyt.hash(this.password,10);
//         console.log(this.password);
//         next();
//     })
//     const userDatasaved= await user.save();   
// });

app.post('/bye', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'secretkey', (err,authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        res.json({
            message: 'Post created...',
            authData
          });
      }
    });
});

app.post('/login',async (req,res)=>{
    console.log(req.body);
    const {email, password} = req.body;
    await User.findOne({email:email}).then(async (data) => {
        const passwordFromDB = data.password;
        const comparePassword =await brcypt.compare(password,passwordFromDB);
        console.log(comparePassword);
        if(comparePassword){
            //console.log({email, password});
            jwt.sign({email, password}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
                res.json(token);
            });
        }
    });   
})
app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/',(req,res)=>{
    res.render('home');
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      req.token = bearerHeader;
      next();
    }else{
      res.sendStatus(403);
    }
}

app.listen(3000, function () {
    console.log("Server has started on port 3000");
});