const express = require('express');
const User = require('../models/hospital');
const bcrypt = require('bcrypt');
async function register (req,res){
    try{
        const {username,address,email,password} = req.body
        const checkuser = new Promise((resolve,reject)=>{
            User.findOne({username}).then((err,user)=>{
                if(err){
                    reject(new Error(err));
                }
                if(user){
                    reject({err:"User already exists"});

                }

                resolve();
            });
        });


        const checkemial = new Promise((resolve,reject)=>{
            User.findOne({email}).then((err,user)=>{
                if(err){
                     reject(new Error(err));
                }
                if(user){
                    reject({err:"Email already in use"})
                }

                resolve();
            })
        });

        Promise.all([checkuser,checkemial]).then(()=>{
            if(password){
                bcrypt.hash(password,10).then((hashpass)=>{
                    const user = new User({
                        username,
                        address,
                        email,
                        password:hashpass
                    });

                    user.save().then((result)=>{
                        res.json("Successfully registered");
                    }).catch((err)=>{
                        console.log(err);
                    })
                })
            }
        }).catch((err)=>{
            console.log(err);
        })



    }
    catch(err){
        console.log(err);
    }
    
    
}

module.exports = register
