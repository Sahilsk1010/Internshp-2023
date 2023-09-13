const express = require('express');
const User = require('../models/hospital');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyuser  = async(req,res,next)=>{
    try{
        const {username} = req.method == "GET" ? req.query : req.body;
        let user = await User.findOne({username});
        if(!user){
            return res.status(404).json("Can't find the user");

        }
        next();

    }catch(err){
        console.log(err);
    }
    
    
}
module.exports = verifyuser;