import jwt from "jsonwebtoken";
import keys from "../keys.js";
import User from "../models/User.js";

export default (req,res,next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({
            message:'User must be logged in!'
        })
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,keys.SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({
                message:'Not Authorized!'
            })
        }
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
    })
}