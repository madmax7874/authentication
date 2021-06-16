const express = require('express');
const path = require('path');
const app = express();
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

async function securePassword(password){
    const passwordHash= await brcypt.hash(password,10);
    return passwordHash;
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      req.token = bearerHeader;
      next();
    }else{
      res.sendStatus(403);
    }
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

app.post('/login',async (req,res)=>{
    const {email, password} = req.body;
    await User.findOne({email:email}).then(async (data) => {
        const passwordFromDB = data.password;
        const comparePassword =await brcypt.compare(password,passwordFromDB);
        console.log(comparePassword);
        if(comparePassword){
            const token = generateToken(data._id)
            console.log(token);
            res.cookie('nToken',token,{maxAge:36000000})
            res.send(token);
        }
    });   
})
app.get('/login',(req,res)=>{
    res.render('login');
});

// app.post('/bye', verifyToken, (req, res) => {  
//     console.log(req.cookies.nToken);
//     jwt.verify(req.token, 'secretkey', (err,authData) => {
//         if(err) {
//             res.sendStatus(403);
//         } else {
//             res.json({
//                 message: 'Post created...',
//                 authData
//             });
//         }
//     });
// });

function decodeToken(token){
    const decoded = jwt.verify(token, 'secretkey');
    return decoded.id;
}

app.post('/bye',(req, res) => {  
    console.log(req.cookies.nToken);
    const _id = decodeToken(req.cookies.nToken);
    User.findOne({_id:_id}).then((data)=>{
        console.log(data);
        res.json(data.firstName);
    });
});

app.get('/',(req,res)=>{
    res.render('home');
});

app.listen(3000, function () {
    console.log("Server has started on port 3000");
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