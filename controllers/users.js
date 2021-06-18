const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const brcypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const User = require('../models/user.js');
const generateToken = require('../utils/generateToken.js');

const postSignup = async (req,res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const passwordHash =await brcypt.hash(password,10);
        const user = await User.create({firstName: firstName,lastName: lastName,email: email,password: passwordHash});
        await User.findOne({email:email}).then((data) => {
            console.log(data);
            const token = generateToken(data._id)
            res.cookie('nToken',token,{maxAge:36000000,httpOnly:true});
            res.redirect('/bye');
        });
    } catch (e) {
        const error = "Email already in use. Try entering another one!";
        res.render('error',{error});
    }
}

const postLogin = (req,res)=>{
    try {
        const {email, password} = req.body;
        User.findOne({email:email}).then(async (data) => {
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
}

const byeRestricted = async (req, res) => {  
    try {
        const decoded = jwt.verify(req.cookies.nToken,  process.env.JWTKEY);
        await User.findOne({_id:decoded.id}).then((data)=>{
            res.render('bye',{data});
        });
    } catch (e) {
        const error = "Please Login first";
        res.render('error',{error});
    }
}

module.exports = {postSignup,postLogin,byeRestricted};