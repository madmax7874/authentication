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

module.exports = {postSignup};