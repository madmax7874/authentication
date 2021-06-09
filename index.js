const express = require('express');
const path = require('path');
const app = express();
const Register = require("./db/conn.js");

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.post('/',(req,res)=>{
    console.log(req.body);
    res.send(req.body);
});

app.get('/',(req,res)=>{
    res.render('form');
});

app.listen(3000, function () {
    console.log("Server has started on port 3000");
});