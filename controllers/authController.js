import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from "crypto";
import keys from "../keys.js";

// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user:'kumarutkarsh305@gmail.com',
//         pass:'app-password',
//     }
// })

const signup = async(req,res) => {
    const {name,email,photoUrl,password} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:'Please fill out all the fields!'});
    }

    const user = await User.findOne({email:email});

    if(user){
        return res.json({error:'User aleready exists!'});
    }
    bcrypt.hash(password,12)
        .then(async hashedpassword=>{
            const newuser = new User({
                name,
                email,
                photoUrl: photoUrl ? photoUrl : "https://media.istockphoto.com/vectors/gender-neutral-profile-avatar-front-view-of-an-anonymous-person-face-vector-id1326784239?k=20&m=1326784239&s=612x612&w=0&h=6ucAFZTLfvzPlKJrgJ9gvY0RXG5piwR4AjwIB_crwcw=",
                password:hashedpassword
            });

            try {
                let save = await newuser.save();
                console.log(save);

                // await transporter.sendMail({
                //     to:email,
                //     from:"kumarutkarsh305@gmail.com",
                //     subject:'Singup Success',
                //     html:'<h1>Welcome to Tickets!</h1>'
                // })

                return res.json({message:'Saved successfully!'})
            } catch (error) {
                return res.json({
                    message: "Error!"
                })
            }
        })
}

const login = async(req,res) => {
    const {email,password} = req.body
    if(!email || !password){
       return res.json({error:'Please provide all credentials!'})
    }

    const user = await User.findOne({email: email});

    if(!user){
        return res.json({error:'Invalid email or password!'})
     }

     await bcrypt.compare(password,user.password)
         .then(match=>{
             if(match){
                 const token = jwt.sign({_id:user._id},keys.SECRET)
                 const {_id,name,email,photoUrl,followers,following} = user
                 return res.json({token,user:{_id,name,email,photoUrl,followers,following}})
             }else{
                 return res.json({message:'Email and Password does not match!'})
             }
         }).catch(err=>console.log(err))
            
}

const resetPassword = async(req,res) => {
    crypto.randomBytes(32, async(err,buffer) => {
        if(err){
            return console.log(err);
        }

        const token = buffer.toString("hex");
        const user = await User.findOne({email: req.body.email});

        if(!user){
            return res.status(422).json({
                message: "User does not exists!"
            });
        } 

        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        
        try {
            let save = await user.save();
            console.log(save);

            transporter.sendMail({
                to:req.body.email,
                from:'kumarutkarsh305@gmail.com',
                subject:"Tickets - You Requested for Change of Password",
                html:`
                <h1>Reset password for ${user.email}</h1>
                <h4>To reset your password follow this <a href="http://localhost:3000/reset/${token}">link</a></h4>
                `
            }).then(res.json({
                message:'Check your Mail!'
            }));
        } catch (error) {
            return res.json({
                error: "Server Error!"
            });
        }
        
    })
};

const newPassword = async(req,res) => {
    const newPassword = req.body.password
    const senttoken = req.body.token

    const user = await User.findOne({resetToken: senttoken, expireToken: {$gt: Date.now()}});

    if(!user){
        return res.status(422).json({
            error: "Session Expired!"
        });
    } else {
        bcrypt.hash(newPassword,12).then(async hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined

            try{
                let save = await user.save();
                console.log(save);
                return res.json({
                    message: "Sucessfully Updated!"
                })
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Server Error!"
                })
            }
        })
    }
}

export default {
    signup,
    login,
    resetPassword,
    newPassword
};