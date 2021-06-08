const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/',function(req,res){
    res.render('form');
});

app.listen(3000, function () {
    console.log("Server has started on port 3000");
  });