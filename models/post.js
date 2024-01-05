const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types//making relation to user model

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    }
    ,body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:'User'}],//this is for likes from user table it collect user id
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:'User'}
    }],//this is for coment from user table it collect user id
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model('Post',postSchema)