const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userData',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected')
});

const userDatabase= new mongoose.Schema({
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

const newUser= mongoose.model('Register', userDatabase);