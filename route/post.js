const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../Middleware/requireLogin");
const Post =mongoose.model('Post')
const User =mongoose.model('User')

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate('postedBy','_id name')//this method is used to return all the value of user from the database to front end
                                    //otherwise it returns only user id with response second parameter is specifies which values you want to return
                                    //to front end in this case id and name sending to user
    .populate("comments.postedBy","_id name")
    .then(posts=>
        
        
        (res.json({posts}))
    
    )
    .catch(err=>console.log(err))
})




router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy','_id name')//this method is used to return all the value of user from the database to front end
                                    //otherwise it returns only user id with response second parameter is specifies which values you want to return
                                    //to front end in this case id and name sending to user
    .populate("comments.postedBy","_id name")
    .then(posts=>
        
        
        (res.json({posts}))
    
    )
    .catch(err=>console.log(err))
})




router.post('/createpost',requireLogin,(req,res)=>{

    const {title,postcontent,pic}=req.body
    // console.log(pic,)

    if(!title || !postcontent || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password=undefined;//making user password hidden to user in the response
    const post=new Post({
        title,body:postcontent,postedBy:req.user,photo:pic
    })
    post.save().then(result=>res.json({post:result})).catch(err=>console.log(err))
})


router.get('/myposts',requireLogin,(req,res)=>{
    // console.log(req.user._id)
    Post.find({postedBy:req.user._id})
    .populate('postedBy',"_id name")
    .then(posts=>res.json({posts}))
    .catch(err=>console.log(err))
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}},
    { new:true})
    .populate("comments.postedBy","_id name")
   .populate("postedBy","_id name")
    .exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
        res.json(result)
        
    }
})    
})






router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
    $pull:{followers:req.user._id}
    },{
    new:true
})
.exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }
    User.findByIdAndUpdate(req.user._id,{
        $pull:{following:req.body.unfollowId}
    }
    ,{new:true})
    .select("-password")
    .then(result=>{
        res.json(result)
    })
    .catch(err=>res.status(422).json({error:err}))

})    
})



router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
    },{
    new:true
})
.populate("postedBy","_id name")
.exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
        res.json(result)
        
    }
})    
})


router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
    },{
    new:true
})
.populate("postedBy","_id name")
.exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
         res.json(result)
    }
})    
})


router.delete('/deletepost/:postId',requireLogin,(req,res)=>{

    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>(console.log(err)))
        }
    })

})

module.exports=router;