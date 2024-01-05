const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')

const { JSON_SECRET } = require('../key')

const User=mongoose.model('User')

module.exports =(req,res,next)=>{

    const {authorization}=req.headers
    //authorization=Bearer ksfgdfkshkfhskjdhfskjfhskjhfskjhfslk
    if(!authorization){
        return res.status(422).json({error:"You must be logged in"})
    }

    const token =authorization.replace("Bearer ","")

    jwt.verify(token,JSON_SECRET,(err,payload)=>{
        if(err)
        {
           return res.status(422).json({error:"You must be logged in"})
        }

        const {_id}=payload
        User.findById(_id).then(existinguser=>
            {
                req.user=existinguser        
                next();
        })

    })
}