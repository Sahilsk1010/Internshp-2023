// const express =  require('express');
const  register  = require('../controllers/authen');
// const {login,token}  = require('../controllers/login');
const express = require('express');

const User = require('../models/hospital');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpgenerator = require('otp-generator');
const { lowerCase, upperCase } = require('lodash');
const router = express.Router();

const verify = require('../controllers/login')

const otp = async(req,res)=>{
    req.app.locals.OTP = await otpgenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
    res.json({code : req.app.locals.OTP})
}

const localvariables = (req,res,next)=>{
    req.app.locals = {
        OTP:null,
        reset:false
    }
    next();
}
const verifyotp = (req,res)=>{
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null
        req.app.locals.reset = true
        return res.status(200).json("OTP is correct");
    }
    return res.status(400).json("Invalid Otp");
}

const createsession = (req,res)=>{
    if(req.app.locals.reset){
        req.app.locals.reset = false
        return res.status(201).json("Access Granted");
    }
    return res.status(400).json("Session Expired");
}

const resetpassword = (req,res)=>{
    try{
        const {username,password} = req.body;
        if(!req.app.locals.reset) return res.status(440).json("Session Expired");
            User.findOne({username}).then((user)=>{
                if(!user){
                    return res.status(400).json("User does not exist");
                }
                bcrypt.hash(password,10).then((hashedpassword)=>{
                    User.updateOne({username:user.username},{password:hashedpassword}).then((data)=>{
                        res.status(200).json(data);
                    }).catch((err)=>{
                        console.log(err);
                    })
                })

            
            }).catch((err)=>{
                console.log(err);
            })

        

    }catch(err){
        res.status(400).json("Sorry");
    }
}
router.route("/generateotp").get(verify,localvariables,otp)
router.route("/verfiyotp").get(verifyotp)
router.route("/resetpassword").put(resetpassword)
module.exports = router;