const mongoose = require('mongoose');
const server = mongoose.connect('mongodb://localhost:27017/userData',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected')
});

module.exports = server;