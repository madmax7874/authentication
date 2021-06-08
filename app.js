const express = require('express');
const path = require('path');
const app = express();

app.use('/static',express.static('static'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'/form.html'));
});



app.listen(3000);