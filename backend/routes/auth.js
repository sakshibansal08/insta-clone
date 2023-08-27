const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");

router.get('/' , (req,res)=>{
    res.send("hello");
})

router.post('/signup',(req,res)=>{
    const{name , username , email , password} = req.body;
    if(!name || !username || !email || !password){
        return res.status(422).json({error: "please add all the fields"});
    }
    USER.findOne({$or:[{email : email} , {username:username}]}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error : "user already exists with same username or email"})
        }
        bcrypt.hash(password , 12).then((hashedPassword)=>{
            const user = new USER({
                name,
                username,
                email,
                password : hashedPassword
            })
            user.save()
            .then(user =>{
                res.json({message : "signup successfull"})
            })
            .catch(err =>{
                console.log(err);
            })
        })
    })
})

router.post('login', (req,res)=>{
    const{username , password} = req.body;
    if(!username || !password){
        return res.status(422).json({error: "please enter correct username or password"}); 
    }
    USER.findOne({username : username}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid user"});
        }
        bcrypt.compare(password , savedUser.password)
        .then((match)=>{
            if(match){
                return res.status(200).json({message: "log in successfull"});
            }
            else{
                return res.status(422).json({error: "wrong password"});
            }
        })
        .catch(err=>{console.log(err)})
    })
})

module.exports = router;