const express = require('express');
const path = require('path');
const app = express();
const Register = require("./db/conn.js");

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

let name = "vidholi";

app.get('/',function(req,res){
    res.render('form',{name});
});

app.get('/form',function(req,res){
    res.render('form',{name});
});

app.post('/form',async (req,res)=>{
    try {
        console.log(req.body.email);
        res.send(req.body);
    } catch (error) {
        console.log('err')
    }
})

app.listen(3000, function () {
    console.log("Server has started on port 3000");
  });