const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userData',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected')
});

const userSchema= new mongoose.Schema({
    email:{
        type: String,
        required : true,
        unique:true
    },
    password:{
        type: String,
        required : true
    }
})
const User= mongoose.model('User', userSchema);

app.post('/',async (req,res)=>{
    console.log(req.body);
    res.send(req.body); 
    const {email, password} = req.body;
    const user = await User.create({
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