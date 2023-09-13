const mongoose = require('mongoose');
function conn(){
    mongoose.connect('mongodb://127.0.0.1:27017/hospitaldb').then(()=>console.log("Database connection successful")).catch((err)=>{console.log(err)});

} 
module.exports = conn;