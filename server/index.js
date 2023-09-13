const express = require('express');
const app = express();
const connect = require('./database/connection');
const conn = require('./database/connection');
const auth = require('./routes/auth');
const otp = require('./routes/otp')
const bodyParser =  require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", (req, res) => {
    res.json("Sorry");
});
app.use("/api/auth",auth);
app.use("/",otp);
conn();


app.listen(3000, () => {
    console.log("Server is running at port 5000");
});
