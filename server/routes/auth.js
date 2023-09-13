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
// const login = require('../controllers/login')
// const midd = require('../middlewares/as');
router.post("/register",async(req,res)=>{
    try{
        await register(req,res)

    }
    catch(err){
        console.log(err);
        res.json("Internal Error");
    }
    
});
// router.post("/login",(req,res)=>{
//     const {name,password} = req.body;
//     try{
//         User.findOne({name}).then((err,user)=>{
//             if(err){
//                 console.log(err);
//                 return res.json("Internal Error");
//             }
//             if(user){
//                 bcrypt.compare(password,user.password,(err,result)=>{
//                     if(err){
//                         console.log(err);
//                         return res.json("Internal Error");
//                     }
//                     if(result){
//                         const token = jwt.sign({
//                             userId:user._id,
//                             name:user.name
//                         },"Sahil Sanjeev Kulkarni",{expiresIn:"24h"});

//                         return res.status(200).json(token);
//                     } else {
//                         return res.json("Invalid Password");
//                     }
//                 })
//             } else {
//                 return res.json("User not found");
//             }
//         });
//     }
//     catch(err){
//         console.log(err);
//         return res.json("Internal Error");
//     }
// });


const verify = (req,res,next)=>{
    try{
        const {username} = req.method == "GET" ? req.query: req.body;
        let exe = User.findOne({username});
        if(!exe){
            return res.json("No user exists");
        }
        next();
    }
    catch(err){
        console.log(err);
    }
}
const login = (req,res)=>{
    const {username,password} = req.body;
    // const { username, password } = req.body;
console.log('Username:', username, 'Password:', password);

    
    try{
        User.findOne({username:username}).then((user)=>{
          
            
            if(!user){
                console.log(user)
                return res.json("User does not exist");
            }
            else{
                const checkpassword = bcrypt.compareSync(password,user.password);
                if(!checkpassword){
                    return res.status(400).json("Wrong Password");
                }
                const token = jwt.sign({id:user._id},"secretkey");
                res.json(token);

              
            }

        });
        
    }
    catch(err){
        console.log(err);
        return res.json("Some glitch")
    }

}
router.route("/login").post(verify,login);

router.get("/:id",(req,res)=>{
    const id = req.params.id;
    if(!id){
        return res.status(404).json("No User");
    }
    User.findOne({_id:id}).then((user)=>{
        if(!user){
            return res.status(400).json("Sorry No user");
        }
        return res.status(200).json(user);
    })
});

const midd = async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
       
        if(!token){
            // return res.status(400).json("Unauthorized")
            console.log("SOrry");
        }

        const decodedtoken = await jwt.verify(token.split(" ")[1],"secretkey");
        console.log(decodedtoken);
        req.user = decodedtoken;
        next();

    }catch(err){
        return res.status(500).json("Some Error");
    }
   
}

const update = (req,res)=>{
    try{
        const id = req.user.id.toString();
        const body = req.body;
        
        User.findOneAndUpdate({_id:id},body).then((data)=>{
            return res.status(200).json(data);
    }).catch((err)=>{
        
        return res.json("SOme glitch")
    })

    }catch(err){
        console.log(err);
        return res.json("h");
    }
    
}
router.route("/update").put(midd,update);

const generateotp = (req,res)=>{
    res.status(200).json("hi");
}

router.route("/update").get(generateotp);



module.exports = router;